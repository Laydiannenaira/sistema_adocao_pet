import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

// Rota para listar todos os pets
// Funcionalidade: Visualização de Pets Disponíveis 
app.get('/pets', async (req, res) => {
  const pets = await prisma.pet.findMany();
  return res.status(200).json(pets);
});

// Rota para cadastrar um novo pet
// Operação: CRUD (Create) para pets [cite: 40]
app.post('/pets', async (req, res) => {
  try {
    const { name, species, birth_date, description, status } = req.body;
    const newPet = await prisma.pet.create({
      data: {
        name,
        species,
        birth_date,
        description,
        status,
      },
    });
    return res.status(201).json(newPet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar o pet.' });
  }
});

// Rota para atualizar um pet existente
// Operação: CRUD (Update) para pets 
app.put('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const { name, species, birth_date, description, status } = req.body;

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: id }, // ID é uma string (UUID)
      data: {
        name,
        species,
        birth_date,
        description,
        status,
      },
    });
    return res.status(200).json(updatedPet);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o pet.' });
  }
});

// Rota para deletar um pet
// Operação: CRUD (Delete) para pets 
app.delete('/pets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pet.delete({
      where: { id: id }, // ID é uma string (UUID)
    });
    return res.sendStatus(204);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar o pet.' });
  }
});

// Rota para cadastrar um novo adotante
// Funcionalidade: Gerenciamento de Adotantes 
app.post('/adopters', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const newAdopter = await prisma.adopter.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    return res.status(201).json(newAdopter);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar o adotante.' });
  }
});

// Rota para formalizar a adoção de um pet
// Funcionalidade: Processo de Adoção de Pets 
app.post('/adoptions', async (req, res) => {
  const { pet_id, adopter_id } = req.body;

  try {
    // 1. Verifica se o pet existe e se está disponível
    const petToAdopt = await prisma.pet.findUnique({
      where: { id: pet_id },
    });

    if (!petToAdopt) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    if (petToAdopt.status === 'adotado') { 
      return res.status(400).json({ message: 'Este pet já foi adotado.' });
    }

    // 2. Verifica se o adotante existe
    const adopter = await prisma.adopter.findUnique({
      where: { id: adopter_id },
    });

    if (!adopter) {
      return res.status(404).json({ message: 'Adotante não encontrado.' });
    }

    // 3. Realiza a adoção e atualiza o status do pet em uma única transação
    // O status do pet é atualizado automaticamente para "adotado"
    const newAdoption = await prisma.$transaction(async (prisma) => {
      // Cria o registro de adoção
      const adoption = await prisma.adoption.create({
        data: {
          petId: pet_id,
          adopterId: adopter_id,
          adoptionDate: new Date(),
        },
      });

      // Atualiza o status do pet para 'adotado'
      await prisma.pet.update({
        where: { id: pet_id },
        data: { status: 'adotado' },
      });

      return adoption;
    });

    return res.status(201).json(newAdoption);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocorreu um erro no processo de adoção.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});