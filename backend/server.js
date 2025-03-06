import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'master',
  database: 'sigerchat'
});

connection.connect((err) => {
  if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

const app = express();
app.use(express.json());

// Configuração CORS mais completa
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Log para depuração de CORS
  console.log(`Requisição recebida: ${req.method} ${req.path}`);
  
  if (req.method === "OPTIONS") {
    console.log("Respondendo a requisição OPTIONS");
    return res.status(200).end();
  }
  
  next();
});

// Rota para cadastro de usuários
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Dados de cadastro recebidos:", { name, email });

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Erro SQL ao cadastrar:", err);
      return res.status(500).json({ error: "Erro ao cadastrar usuário", details: err.message });
    }
    console.log("Usuário cadastrado com sucesso:", result.insertId);
    res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: result.insertId });
  });
});

// Rota para login de usuários - Melhorada
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Tentativa de login:", email);

  if (!email || !password) {
    console.log("Login falhou: campos incompletos");
    return res.status(400).json({ error: "Email e senha são obrigatórios!" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Erro SQL no login:", err);
      return res.status(500).json({ error: "Erro ao buscar usuário", details: err.message });
    }

    if (results.length === 0) {
      console.log("Login falhou: usuário não encontrado");
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const user = results[0];
    
    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      
      if (!isPasswordCorrect) {
        console.log("Login falhou: senha incorreta");
        return res.status(400).json({ error: "Senha incorreta" });
      }
      
      // Removendo a senha do objeto usuário antes de enviar
      const { password: _, ...userWithoutPassword } = user;
      
      console.log("Login bem-sucedido:", email);
      res.status(200).json({ 
        message: "Usuário logado com sucesso!", 
        user: userWithoutPassword 
      });
    } catch (bcryptError) {
      console.error("Erro na verificação de senha:", bcryptError);
      return res.status(500).json({ error: "Erro na verificação de senha" });
    }
  });
});

// Rota para buscar usuários
app.get("/users", async(req, res) => {
  console.log("Buscando todos os usuários");
  const sql = "SELECT id, name, email FROM users";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro SQL ao buscar usuários:", err);
      return res.status(500).json({ error: "Erro ao buscar usuários", details: err.message });
    }
    console.log(`Retornando ${results.length} usuários`);
    res.status(200).json(results);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
