const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();


const db = mysql.createPool({
  host: "localhost",      
  user: "root",           
  password: "",           
  database: "RBFS", 
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


app.use(express.json());
app.use(cors());

// Vacinas

// Rota para listar vacinas
app.get("/clinicas", async (req, res) => {
  try {
    const [clinicas] = await db.query("SELECT * FROM Clinicas");
    res.json(clinicas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar clínicas" });
  }
});

// Rota para cadastrar clínica
app.post("/clinicas", async (req, res) => {
  const { nome, endereco, telefone, responsavel } = req.body;

  if (!nome || !endereco) {
    return res.status(400).json({ erro: "Nome e endereço são obrigatórios!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO Clinicas (nome, endereco, telefone, responsavel) VALUES (?, ?, ?, ?)",
      [nome, endereco, telefone, responsavel]
    );
    res.status(201).json({ id: result.insertId, nome, endereco, telefone, responsavel });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar clínica" });
  }
});

app.patch("/clinicas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, endereco, telefone, responsavel } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Clinicas SET nome = ?, endereco = ?, telefone = ?, responsavel = ? WHERE id = ?",
      [nome, endereco, telefone, responsavel, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Clínica não encontrada" });
    }

    res.json({ mensagem: "Clínica atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar clínica" });
  }
});

app.delete("/clinicas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM Clinicas WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Clínica não encontrada" });
    }

    res.json({ mensagem: "Clínica excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir clínica" });
  }
});

// Mantimentos

// Rota para listar mantimentos
app.get("/mantimentos", async (req, res) => {
  try {
    const [mantimentos] = await db.query("SELECT * FROM mantimentos");
    res.json(mantimentos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar mantimentos" });
  }
});

// Rota para cadastrar mantimento
app.post("/mantimentos", async (req, res) => {
  const { nome, quantidade, validade } = req.body;

  if (!nome || !quantidade || !validade) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  const validadeDate = new Date(validade);
  const today = new Date();
  if (validadeDate <= today) {
    return res.status(400).json({ erro: "A data de validade deve ser futura!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO mantimentos (nome, quantidade, validade) VALUES (?, ?, ?)",
      [nome, quantidade, validade]
    );
    res.status(201).json({ id: result.insertId, nome, quantidade, validade });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar mantimento" });
  }
});

// Atualizar mantimento
app.patch("/mantimentos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, validade, unidade_medida, descricao } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE mantimentos SET nome = ?, quantidade = ?, validade = ?, unidade_medida = ?, descricao = ? WHERE id = ?",
      [nome, quantidade, validade, unidade_medida, descricao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Mantimento não encontrado" });
    }

    res.json({ mensagem: "Mantimento atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar mantimento" });
  }
});

// Deletar mantimento
app.delete("/mantimentos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM mantimentos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Mantimento não encontrado" });
    }

    res.json({ mensagem: "Mantimento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar mantimento" });
  }
}); 

// Rota para listar vacinas 
// Corrigido: faltava a barra no GET
app.get("/vacinas", async (req, res) => {
  try {
    const [vacinas] = await db.query("SELECT * FROM vacinas");
    res.json(vacinas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar vacinas" });
  }
});

// Rota para cadastrar vacina
app.post("/vacinas", async (req, res) => {
  const { nome, tipo, fabricante, lote, dados_fabricacao, validade } = req.body;

  if (!nome || !tipo || !fabricante || !lote || !dados_fabricacao || !validade) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO vacinas (nome, tipo, fabricante, lote, dados_fabricacao, validade) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, tipo, fabricante, lote, dados_fabricacao, validade]
    );

    res.status(201).json({ id: result.insertId, nome, tipo, fabricante, lote, dados_fabricacao, validade });
  } catch (error) {
    console.error("Erro ao cadastrar vacina:", error); // ESSENCIAL!
    res.status(500).json({ erro: "Erro ao cadastrar vacina" });
  }
});


// Rota para atualizar vacina
app.patch("/vacinas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, fabricante, lote, dados_fabricacao, validade } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE vacinas SET nome = ?, tipo = ?, fabricante = ?, lote = ?, dados_fabricacao = ?, validade = ? WHERE id = ?`,
      [nome, tipo, fabricante, lote, dados_fabricacao, validade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Vacina não encontrada" });
    }

    res.json({ mensagem: "Vacina atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar vacina:", error); // 👈 ESSENCIAL!
    res.status(500).json({ erro: "Erro ao atualizar vacina" });
  }
});


// Rota para deletar vacina
app.delete("/vacinas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM vacinas WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Vacina não encontrada" });
    }

    res.json({ mensagem: "Vacina deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar vacina:", error); 
    res.status(500).json({ erro: "Erro ao deletar vacina" });
  }
});

// Rota para listar voluntarios
app.get("/voluntarios", async (req, res) => {
  try {
    const [voluntarios] = await db.query("SELECT * FROM voluntarios");
    res.json(voluntarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar voluntários" });
  }
});

// Rota para cadastrar voluntario  
app.post("/voluntarios", async (req, res) => {
  const { nome, contato, habilidades, disponibilidade } = req.body;

  if (!nome || !contato || !habilidades || !disponibilidade) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO voluntarios (nome, contato, habilidades, disponibilidade) VALUES (?, ?, ?, ?)",
      [nome, contato, habilidades, disponibilidade]
    );
    res.status(201).json({ id: result.insertId, nome, contato, habilidades, disponibilidade });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar voluntário" });
  }
}); 

// Rota para atualizar voluntario
app.patch("/voluntarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, contato, habilidades, disponibilidade } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE voluntarios SET nome = ?, contato = ?, habilidades = ?, disponibilidade = ? WHERE id = ?",
      [nome, contato, habilidades, disponibilidade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Voluntário não encontrado" });
    }

    res.json({ mensagem: "Voluntário atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar voluntário" });
  }
});

// Rota para deletar voluntario
app.delete("/voluntarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM voluntarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Voluntário não encontrado" });
    }

    res.json({ mensagem: "Voluntário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar voluntário" });
  }
});


// Iniciar servidor
app.listen(3002, () => {
  console.log("Servidor rodando na porta 3002...");
});
