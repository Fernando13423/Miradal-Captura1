'use client';
import { useState } from 'react';
import './style.css';

export default function Encuesta() {
  const [conoce, setConoce] = useState('');
  const [nombre, setNombre] = useState('');
  const [percepciones, setPercepciones] = useState({
    aves: '',
    peces: '',
    ganado: '',
    ranas: '',
    insectos: '',
    desechos: '',
    agua: '',
  });
  const [huele, setHuele] = useState('');
  const [comentario, setComentario] = useState('');

  const manejarCambioPercepcion = (e) => {
    const { name, value } = e.target;
    setPercepciones(prev => ({ ...prev, [name]: value }));
  };

 const manejarEnvio = (e) => {
  e.preventDefault();

  // Validación
  if (conoce === '') {
    alert('Por favor, responde si conoces el nombre del humedal.');
    return;
  }
  if (conoce === 'si' && nombre.trim() === '') {
    alert('Por favor, escribe el nombre del humedal.');
    return;
  }

  // Validar percepciones
  const camposPercepcion = ['aves', 'peces', 'ganado', 'ranas', 'insectos', 'desechos', 'agua'];
  for (let campo of camposPercepcion) {
    if (percepciones[campo] === '') {
      alert(`Por favor, responde si ves o escuchas: ${campo}.`);
      return;
    }
  }

  if (huele === '') {
    alert('Por favor, indica si percibes olores.');
    return;
  }

  // Si todo está completo, proceder a enviar
  const timestamp = new Date().toISOString();
  const idRespuesta = `${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36)}`;

  const datos = {
    "id-respuesta": idRespuesta,
    respuestas: [
      { item: "conoce-nombre-humedal", respuesta: conoce },
      { item: "nombre-humedal", respuesta: conoce === 'si' ? nombre : '' },
      { item: "percibe-aves", respuesta: percepciones.aves },
      { item: "percibe-peces", respuesta: percepciones.peces },
      { item: "percibe-ganado", respuesta: percepciones.ganado },
      { item: "percibe-ranas", respuesta: percepciones.ranas },
      { item: "percibe-insectos", respuesta: percepciones.insectos },
      { item: "percibe-desechos", respuesta: percepciones.desechos },
      { item: "percibe-agua-turbia", respuesta: percepciones.agua },
      { item: "huele", respuesta: huele },
      { item: "comentario", respuesta: comentario || '' },
    ]
  };

  console.log(datos);
  alert('Respuestas enviadas. Revisa la consola.');
};


  return (
    <form onSubmit={manejarEnvio} className="formulario">
      <h1 className="titulo">Encuesta MIRADAL</h1>

      <div className="bloque-pregunta">
        <p className="pregunta-titulo">¿Sabes cuál es el nombre de este humedal?</p>
        <label>
          <input type="radio" name="conoce" value="si" onChange={() => setConoce('si')} /> Sí
        </label>
        <label>
          <input type="radio" name="conoce" value="no" onChange={() => setConoce('no')} /> No
        </label>
      </div>

      {conoce === 'si' && (
        <div className="bloque-pregunta">
          <p className="pregunta-titulo">¿Cuál es el nombre?</p>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe el nombre del humedal"
            className="input-text"
          />
        </div>
      )}

      <div className="bloque-pregunta">
        <p className="pregunta-titulo">¿Ves o escuchas?</p>
        {[
          ['Aves', 'aves'],
          ['Peces', 'peces'],
          ['Ganado', 'ganado'],
          ['Ranas', 'ranas'],
          ['Insectos', 'insectos'],
          ['Desechos/basura', 'desechos'],
          ['Agua turbia', 'agua'],
        ].map(([etiqueta, nombre]) => (
          <div key={nombre} className="opciones">
            <span>{etiqueta}</span>
            <label>
              <input type="radio" name={nombre} value="si" onChange={manejarCambioPercepcion} /> Sí
            </label>
            <label>
              <input type="radio" name={nombre} value="no" onChange={manejarCambioPercepcion} /> No
            </label>
          </div>
        ))}
      </div>

      <div className="bloque-pregunta">
        <p className="pregunta-titulo">¿Percibes olores?</p>
        {['no, no percibo olores', 'sí, y no son molestos', 'sí, y son molestos'].map((opcion, index) => (
          <label key={index} className="opciones">
            <input
              type="radio"
              name="huele"
              value={index + 1}
              onChange={(e) => setHuele(e.target.value)}
            />
            {opcion}
          </label>
        ))}
      </div>

      <div className="bloque-pregunta">
        <p className="pregunta-titulo">Agrega un comentario respecto al humedal si quieres:</p>
        <textarea
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Escribe tu comentario aquí..."
          className="input-textarea"
        />
      </div>

      <div className="submit-container">
        <button type="submit" className="submit-btn">Enviar respuestas</button>
      </div>
    </form>
  );
}
