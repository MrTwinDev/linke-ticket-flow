       // vite.config.ts
       import { defineConfig } from "vite";
       // Usar @vitejs/plugin-react (baseado em Babel)
       import react from "@vitejs/plugin-react";
       import path from "path";
       // A importação de 'lovable-tagger' foi removida
   
       // https://vitejs.dev/config/
       export default defineConfig(({ mode }) => ({
         server: {
           host: "::", // Permite acesso de qualquer host, bom para contêineres
           port: 8080,
         },
         plugins: [
           react(),
           // A linha referente ao componentTagger() foi removida
         ],
         resolve: {
           alias: {
             // Certifique-se de que o __dirname está disponível ou use uma alternativa
             // para resolver o caminho no contexto do ESM se necessário.
             // Em muitos setups Vite com ESM, `import.meta.url` é usado para construir caminhos.
             // No entanto, para alias, `path.resolve` com `__dirname` (se o seu setup o suportar)
             // ou um caminho relativo direto pode funcionar.
             // Se __dirname causar problemas no seu setup ESM do StackBlitz, avise-me.
             "@": path.resolve(__dirname, "./src"),
           },
         },
       }));
       