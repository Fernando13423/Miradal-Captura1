'use client'; 

import { useState, useRef } from 'react'; //esto es para limpiar el formulario, por si fuera necesario
import './style.css'; 
import Image from 'next/image'; 
import ReCAPTCHA from 'react-google-recaptcha';

export default function Encuesta() {  
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);  
  const [modoOscuro, setModoOscuro] = useState(false);  

    //  Estado del captcha
  const [captchaValido, setCaptchaValido] = useState(false);

  //  Función para verificar el captcha
  const verificarCaptcha = (valor) => {
    if (valor) {
      setCaptchaValido(true);
    } else {
      setCaptchaValido(false);
    }
  };

  // Función para alternar el modo oscuro
  const toggleModo = () => {
    setModoOscuro(!modoOscuro);  // Alterna el valor del estado de modoOscuro
    document.body.classList.toggle('modo-oscuro');  
  };

  // Estado para manejar la respuesta de si conoce o no el nombre del humedal
  const [conoce, setConoce] = useState('');
  const [nombre, setNombre] = useState(''); //nombre del humedal
  const [percepciones, setPercepciones] = useState({  //percepciones sobre el humedal
    aves: '',
    peces: '',
    ganado: '',
    ranas: '',
    insectos: '',
    desechos: '',
    agua: '',
  });
  const [huele, setHuele] = useState(''); // si percibe olores
  const [comentario, setComentario] = useState('');  //el comentario adicional


  const [formularioEnviado, setFormularioEnviado] = useState(false); // 🆕 CAMBIO: Controla si se envió el formulario
  const mensajeFinalRef = useRef(null); // 🆕 CAMBIO


  const captchaRef = useRef(null); //  CAMBIO: se creó la referencia del captcha(PARA CUANDO SE LIMPIE EL FORMULARIO)
  

  const manejarCambioPercepcion = (e) => {
    const { name, value } = e.target;  
    setPercepciones(prev => ({ ...prev, [name]: value })); 
  };

  // Función que maneja el envío del formulario
  const manejarEnvio = async(e) => {
    e.preventDefault();  // Previene que la página se recargue al enviar el formulario

        //  Nueva validación del captcha
    if (!captchaValido) {
      alert('Por favor, verifica el captcha.');
      return;
    }

    // Validación de los campos
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

    // Si todo está correcto, se genera un ID único para la respuesta
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Genera un número aleatorio entre 00 y 99
    const idRespuesta = `${Date.now()}${random}`; // Genera un ID único combinando el tiempo actual y el número aleatorio

    
    const datos = {
      "id_respuesta": idRespuesta,
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
  
    // Aquí es donde normalmente se enviaría a la API (con un fetch o axios)
    console.log(datos);  
    

    try {
     const respuesta = await fetch('https://miradal-api.vercel.app/api/guardarRespuesta ', { // Cambiar por el endpoint real.
          method: 'POST',
          headers: {
                'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos),
      });

      if (respuesta.ok) {
        // Opcional: Limpiar el formulario después de enviar
        setConoce('');
        setNombre('');
        setPercepciones({
          aves: '',
          peces: '',
          ganado: '',
          ranas: '',
          insectos: '',
          desechos: '',
          agua: '',
        });
        setHuele('');
        setComentario('');
        setCaptchaValido(false);
        captchaRef.current?.reset(); //resetear el captcha visualmente
        setFormularioEnviado(true); //Activar mensaje de agradecimiento
        mensajeFinalRef.current?.scrollIntoView({ behavior: 'smooth' }); // 🆕 CAMBIO: hacer scroll

      } else {
        alert('Hubo un error al enviar las respuestas');
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un problema al conectar con el servidor.');
    }
    


  };
  return (
    <div>
      <button className="modo-boton" onClick={toggleModo}>
        <img
          src={modoOscuro ? 'luna.png' : 'sol.png'} 
          alt="Cambiar modo"
          className="icono-modo"
        />
      </button>

       
      {!formularioEnviado ? ( // Mostrar formulario solo si no fue enviado 
        <form onSubmit={manejarEnvio} className="formulario">
          <div className="imagen-cabecera">
            <Image
              src="/image2.jpg"
              alt="Humedal del campus Miraflores"
              width={1000}
              height={300}
              style={{width: '100%',height: 'auto',objectFit: 'cover'}} />
            <h1 className="titulo-imagen">MIRADAL</h1>
          </div>

          {/* Información del humedal */}
          <div className="info-humedal">
            <h2 className='titulo-humedal'>Encuesta MIRADAL</h2>
            <p className="intro-encuesta">Captura de percepciones sobre el humedal del Campus Miraflores</p>

          <button
            type="button"
            className="boton-ver-mas"
            onClick={() => setMostrarDescripcion(!mostrarDescripcion)}
          >
            {mostrarDescripcion ? 'Ver menos' : 'Ver más'}
          </button>


            <div className={`descripcion-encuesta desplegable ${mostrarDescripcion ? 'activo' : ''}`}>
              <p>
                          Esta encuesta forma parte del proyecto MIRADAL, 
                una iniciativa estudiantil que busca recopilar 
                información sobre la percepción que tienen las 
                personas acerca del estado actual del humedal 
                ubicado en el Campus Miraflores de la Universidad 
                Austral de Chile.
              </p>
            </div>


          
          </div>

          <div className="bloque-pregunta">
            <p className="pregunta-titulo">¿Sabes cuál es el nombre de este humedal?</p>
            <div className="opciones-conoce">
              <label>
                <input type="radio" name="conoce" value="si" onChange={() => setConoce('si')} /> Sí
              </label>
              <label>
                <input type="radio" name="conoce" value="no" onChange={() => setConoce('no')} /> No
              </label>
            </div>
          </div>


            <div className={`bloque-pregunta desplegable ${conoce === 'si' ? 'activo' : ''}`}>
              <p className="pregunta-titulo">¿Cuál es el nombre?</p>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Escribe aquí el nombre del humedal"
                className="input-text"
              />
              </div>


        
          <div className="bloque-pregunta">
            <p className="pregunta-titulo">En ESTE MOMENTO, ¿Ves o escuchas...?</p>
            <div className="encabezado-opciones">
              <span></span>
              <span>Sí</span>
              <span>No</span>
            </div>

          
            {[
              ['Aves', 'aves'],
              ['Peces', 'peces'],
              ['Ganado', 'ganado'],
              ['Ranas', 'ranas'],
              ['Insectos', 'insectos'],
              ['Desechos', 'desechos'],
              ['Agua turbia', 'agua'],
            ].map(([etiqueta, nombre]) => (
              <div key={nombre} className="opciones">
                <span>{etiqueta}</span>
                <input type="radio" name={nombre} value="si" onChange={manejarCambioPercepcion} />
                <input type="radio" name={nombre} value="no" onChange={manejarCambioPercepcion} />
              </div>
            ))}
          </div>

        
          <div className="bloque-pregunta">
            <p className="pregunta-titulo">¿Percibes olores?</p>
            {['No, no percibo olores', 'Sí, y no son molestos', 'Sí, y son molestos'].map((opcion, index) => (
              <label key={index} className="opcion-linea">
                <input
                  type="radio"
                  name="huele"
                  value={index + 1}
                  onChange={(e) => setHuele(e.target.value)} // Actualiza el estado 'huele'
                />
                {opcion}
              </label>
            ))}
          </div>

          
          <div className="bloque-pregunta">
            <p className="pregunta-titulo">Si lo deseas, puedes agregar un comentario sobre el humedal:</p>
            <textarea
              name="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)} // Actualiza el estado 'comentario'
              rows="4"
              cols="50"
              maxLength={200} 
              placeholder="Escribe tu comentario aquí..."
              className="input-textarea"
            />
          </div>

          
          {/* 🆕 Aquí insertamos el captcha */}
            
          <div className="bloque-captcha">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={verificarCaptcha}
              />
          </div>

          
          <div className="submit-container">
            <button type="submit" className="submit-btn">Enviar respuestas</button>
          </div>

          <div className="footer-simple">
             <Image
               src={modoOscuro ? '/logo-uach-oscuro.png' : '/logo-uach.png'}
              alt="Logo UACh"
              width={160}
              height={85}
              className="logo-footer"
            />
            <p>MIRADAL - Ingeniería Civil Informática UACh</p>
            <p>Docente a cargo: Julio Daniel Guerra Hollstein -  jguerra@inf.uach.cl</p>
          </div>

        </form>
      ) : (
        // Contenido mostrado cuando se envía el formulario
        <div ref={mensajeFinalRef} className="mensaje-final">
          <h2>¡Gracias por responder!</h2>
          <p>Tus respuestas han sido registradas correctamente.</p>
          <button className="boton-ir-dashboard" onClick={() => window.location.href = 'https://miradal-dash.vercel.app'}>
            Observar información y percepciones de de demás usuarios sobre el humedal
          </button>
        </div>
      )}
    </div>
  );
}
