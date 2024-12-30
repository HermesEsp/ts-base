const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Função para copiar arquivos e diretórios
const copy = (src, dest) => {
  if (fs.existsSync(src)) {
    if (fs.lstatSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const files = fs.readdirSync(src);
      files.forEach((file) => {
        copy(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
};

// Função para inicializar o novo projeto
const createNewProject = (projectName) => {
  const templateDir = path.join(__dirname, "my-ts-template"); // Diretório com seu template
  const projectDir = path.join(process.cwd(), projectName); // Novo diretório do projeto

  if (fs.existsSync(projectDir)) {
    console.log(`Projeto ${projectName} já existe. Escolha outro nome.`);
    return;
  }

  // Criar o novo diretório do projeto
  fs.mkdirSync(projectDir);

  // Copiar o template para o novo projeto
  console.log(`Criando o projeto ${projectName}...`);
  copy(templateDir, projectDir);

  // Inicializar o npm e instalar as dependências padrão
  console.log("Inicializando o npm...");
  execSync("npm init -y", { cwd: projectDir });

  // Instalar as dependências definidas no template (devDependencies)
  console.log("Instalando dependências...");
  execSync(
    "npm install --save-dev @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier prettier ts-loader ts-node typescript",
    { cwd: projectDir }
  );

  console.log("Dependências instaladas com sucesso.");

  console.log(`Projeto ${projectName} criado com sucesso!`);
};

// Passar o nome do projeto via argumento de linha de comando
const projectName = process.argv[2];
if (!projectName) {
  console.log("Por favor, forneça o nome do projeto.");
  process.exit(1);
}

createNewProject(projectName);
