'use client';
import 'quill/dist/quill.snow.css';

import React, { useEffect, useRef } from 'react';

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null); // Usando apenas useRef para a instância
  const isInitialized = useRef(false); // Controla a inicialização para garantir que Quill só seja inicializado uma vez

  const initializeQuill = async () => {
    if (!isInitialized.current && editorRef.current) {
      try {
        const { default: Quill } = await import('quill');
        const quill = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: [1, 2, false] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'code-block']
            ]
          }
        });
        console.log('QuillEditor: Quill Inicializou', quill);

        quillInstanceRef.current = quill; // Armazenando a instância no useRef
        isInitialized.current = true; // Marca que a inicialização foi feita
      } catch (error) {
        console.error('QuillEditor: Erro ao iniciar o Quill', error);
      }
    }
  };

  useEffect(() => {
    // Evitar inicialização múltipla do Quill
    if (!quillInstanceRef.current) {
      console.log('QuillEditor: Efeito useEffect sendo executado...');
      initializeQuill();
    }

    // Função de limpeza
    return () => {
      if (quillInstanceRef.current) {
        console.log('QuillEditor: Limpando quillInstance...');
        quillInstanceRef.current.destroy(); // Usando a instância de Quill do useRef
        quillInstanceRef.current = null; // Limpando a referência
      }
    };
  }, []); // O useEffect é executado uma vez durante a montagem do componente

  return (
    <div
      style={{
        borderRadius: '5px'
      }}
    >
      <div id="editor" ref={editorRef} />
      <button
        onClick={() => {
          const htmlContent = quillInstanceRef.current?.root.innerHTML;
          console.log('Conteúdo HTML:', htmlContent);
        }}
      >
        Obter conteúdo HTML
      </button>
    </div>
  );
};

export default QuillEditor;
