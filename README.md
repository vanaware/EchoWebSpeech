# 🎙️ Echo Web Speech

Echo Web Speech é um aplicativo web progressivo (PWA) para treino de pronúncia utilizando a Web Speech API.

Permite:
- 🔊 Ouvir palavras no idioma selecionado
- 🎤 Repetir usando o microfone
- 📊 Receber avaliação percentual da pronúncia
- 📱 Instalar como aplicativo
- 📴 Funcionar offline

Atualmente configurado para Mandarim (zh-TW).

---

# 🚀 Como usar

1. Acesse a página publicada no [GitHub Pages](https://vanaware.github.io/EchoWebSpeech/)
2. Instale como aplicativo (opcional)
3. Permita acesso ao microfone
4. Clique em ▶ Ouvir
5. Clique em 🎤 Falar
6. Veja sua pontuação de pronúncia

---

# 📱 Android – Ativar reconhecimento de voz em Mandarim

## 1️⃣ Adicionar idioma Mandarim (Taiwan)

1. Vá em **Configurações**
2. Entre em **Sistema**
3. Toque em **Idiomas e entrada**
4. Selecione **Idiomas**
5. Toque em **Adicionar idioma**
6. Escolha:
   - 中文 (台灣)
   - ou Chinese (Taiwan)

Não é necessário definir como idioma principal.

---

## 2️⃣ Ativar reconhecimento offline (recomendado)

1. Vá em **Configurações**
2. Entre em **Sistema**
3. Vá em **Digitação por voz do Google**
4. Toque em **Reconhecimento de fala offline**
5. Baixe o pacote:
   - Chinese (Taiwan)

Isso melhora a precisão e permite uso offline.

---

## 3️⃣ Permitir microfone no Chrome

1. Abra o site do EchoWebSpeech
2. Quando solicitado, toque em **Permitir microfone**
3. Caso tenha negado anteriormente:
   - Toque no cadeado 🔒 ao lado da URL
   - Vá em Permissões
   - Ative Microfone

---

# 💻 Chrome Desktop (Windows / macOS)

## Windows – Instalar Mandarim

1. Configurações
2. Hora e idioma
3. Idioma e região
4. Adicionar idioma
5. Escolher:
   - Chinese (Traditional, Taiwan)

Instale o pacote de fala se disponível.

---

## macOS – Instalar Mandarim

1. Ajustes do Sistema
2. Idioma e Região
3. Adicionar idioma
4. Escolher:
   - Chinese, Traditional (Taiwan)

Depois:

1. Ajustes do Sistema
2. Acessibilidade
3. Conteúdo Falado
4. Voz do Sistema
5. Baixar voz em Mandarim

---

## Permitir microfone no Chrome

1. Clique no cadeado 🔒 ao lado da URL
2. Permitir Microfone
3. Recarregue a página

---

# 💻 ChromeOS (Chromebook)

## 1️⃣ Adicionar idioma Mandarim

1. Clique no relógio (canto inferior direito)
2. Abra **Configurações**
3. Vá em **Avançado**
4. Selecione **Idiomas e entradas**
5. Clique em **Idiomas**
6. Toque em **Adicionar idiomas**
7. Escolha:
   - Chinese (Traditional, Taiwan)
   - ou 中文（台灣）

---

## 2️⃣ Ativar digitação por voz

1. Vá em **Configurações**
2. Entre em **Acessibilidade**
3. Clique em **Gerenciar recursos de acessibilidade**
4. Ative:
   - Digitação por voz

Depois:

1. Vá em **Idiomas e entradas**
2. Configure o idioma de entrada como:
   - Chinese (Traditional, Taiwan)

---

## 3️⃣ Permitir microfone

1. Clique no cadeado 🔒 ao lado da URL
2. Permita acesso ao microfone
3. Recarregue a página

---

## 4️⃣ Instalar como aplicativo

1. Abra o site no Chrome
2. Clique nos três pontos ⋮
3. Selecione **Instalar EchoWebSpeech**
4. O app ficará disponível como aplicativo independente

---

# 🌙 Recursos

- ✔ Avaliação percentual de pronúncia
- ✔ Feedback qualitativo por faixa de desempenho
- ✔ PWA instalável
- ✔ Cache offline

---

# ⚠️ Observações importantes

- Funciona melhor no Google Chrome
- Safari pode ter limitações na Web Speech API
- A avaliação é baseada em similaridade textual
- Tons do mandarim são avaliados indiretamente pelo reconhecimento

## ✅ Compatibilidade do navegador e como verificar

- Recomendado: Google Chrome (desktop, Android, ChromeOS) atualizado.
- O app usa duas APIs do navegador: `speechSynthesis` (síntese/voz) e `SpeechRecognition` (reconhecimento). Se alguma delas não estiver disponível, o app mostra uma mensagem de feedback explicando que o navegador não é compatível.

- Como testar rápido no próprio navegador:
   1. Abra a página do EchoWebSpeech.
   2. Tente clicar em **▶ Ouvir** — se `speechSynthesis` estiver indisponível verá mensagem no campo de feedback.
   3. Tente clicar em **🎤 Falar** — se `SpeechRecognition` estiver indisponível verá um alerta ou mensagem de feedback.

- Como checar via Console (opcional, para usuários avançados): abra DevTools (F12) → Console e cole:

```javascript
console.log('speechSynthesis:', !!(window.speechSynthesis && window.SpeechSynthesisUtterance));
console.log('SpeechRecognition:', !!(window.SpeechRecognition || window.webkitSpeechRecognition));
```

Se o primeiro for `true`, a síntese de voz está disponível; se o segundo for `true`, o reconhecimento está disponível.

### O que fazer se não estiver disponível
- Atualize o Chrome para a versão mais recente (desktop/Android/ChromeOS).
- Em Android, instale/ative o pacote de reconhecimento por voz em Mandarim (veja seção Android abaixo).
- Em alguns dispositivos (especialmente Safari / iOS) a Web Speech API tem suporte limitado — use Chrome quando possível.

---

# 🔮 Próximas versões

- Melhor conjunto de Frases
- Suporte a múltiplos idiomas


---

Desenvolvido com Web Speech API.

Icon from: [fonts.google.com](https://fonts.google.com/icons?selected=Material+Icons:interpreter_mode:&icon.query=speech&icon.size=24&icon.color=%2348752C)

