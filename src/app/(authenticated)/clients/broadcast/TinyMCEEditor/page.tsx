'use client';
import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';

const TinyMCEEditor = () => {
  const [editorContent, setEditorContent] = useState<string>('');

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div>
      <Editor
        apiKey="2tl55nxymyjiz368pkd4rfpkvie5s4mvvk2qg8ec32bx6jh4"
        initialValue="<p>Insira seu texto aqui!</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview'
        }}
        onEditorChange={handleEditorChange}
      />
      <button onClick={() => console.log('Conteúdo HTML:', editorContent)}>Obter conteúdo HTML</button>
    </div>
  );
};

export default TinyMCEEditor;
