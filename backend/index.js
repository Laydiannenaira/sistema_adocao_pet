import express from 'express';
import { PrismaClient } from '@prisma/client';


const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

app.get('/pets', async (req, res) => {
  const pets = await prisma.pet.findMany();
  return res.json(pets).sendStatus(200);
});

app.post('/pets', async (req, res) => {
  const { name, species, birth_date, description, status  } = req.body;
  const newPet = await prisma.pet.create({
    data: {
      name,
      species,
      birth_date,
      description,
      status
    }
  });
  return res.json(newPet).sendStatus(201);
});

app.put('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const { name, species, birth_date, description, status  } = req.body;

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: Number(id) },
      data: {
        name,
        species,
        type,
        birth_date,
        description,
        status
      }
    });
    return res.json(updatedPet).sendStatus(200);
  } catch (error) {
    // Código de erro do Prisma para "record not found"
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }
    // Lida com outros erros, como um UUID mal formatado
    console.error(error);
    return res.status(500).json("Erro ao atualizar pet");
  }
});

app.delete('/pets/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.pet.delete({
    where: { id: Number(id) }
  });
  return res.sendStatus(204);
});


app.post('/adopters', async (req, res) => {
  const { name, email, phone, address } = req.body;
  const newAdopter = await prisma.adopter.create({  
    data: {
      name,
      email,
      phone,
      address
    }
  });
  return res.json(newAdopter).sendStatus(201);
});

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
    const newAdoption = await prisma.$transaction(async (prisma) => {
      // Cria o registro de adoção na tabela 'Adoções'
      const adoption = await prisma.adoption.create({
        data: {
          pet_id: pet_id,
          adopter_id: adopter_id,
          date_adopted: new Date(), // Registra a data atual da adoção
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
