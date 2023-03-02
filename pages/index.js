import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css?t=1231232132";

export default function Home() {
  const [textoInput, setTexto] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: textoInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Open AI NodeJS</title>
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <div className={styles.inline_div}>
            <textarea type="text" name="texto" value={textoInput} onChange={(e) => setTexto(e.target.value)} className={styles.textarea_edit}></textarea>
            <textarea type="text" name="result" className={styles.textarea_edit} value={result}></textarea>
          </div>
          <input type="submit" value="Enviar"/>
        </form>
      </main>
    </div>
  );
}
