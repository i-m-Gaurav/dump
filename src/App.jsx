import { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';
import useStore from '../store/store';
import './App.css';

function App() {
  const { items, addItem, updateItemPosition } = useStore();
  const [isPasting, setIsPasting] = useState(false);

  useEffect(() => {
    // Setup paste event listener
    const handlePaste = async (e) => {
      e.preventDefault();
      setIsPasting(true);
      
      try {
        const clipboardData = e.clipboardData;
        
        // Handle images
        if (clipboardData.files && clipboardData.files.length > 0) {
          const file = clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              addItem({
                id: uuidv4(),
                type: 'image',
                content: event.target.result,
                position: { x: 100, y: 100 },
                size: { width: 'auto', height: 'auto' },
              });
              setIsPasting(false);
            };
            reader.readAsDataURL(file);
            return;
          }
        }
        
        // Handle text/links
        const text = clipboardData.getData('text/plain');
        if (text) {
          // Check if the text is a URL
          const isUrl = /^(http|https):\/\/[^ "]+$/.test(text.trim());
          
          addItem({
            id: uuidv4(),
            type: isUrl ? 'link' : 'text',
            content: text,
            position: { x: 100, y: 100 },
            size: { width: 300, height: 'auto' },
          });
        }
      } catch (error) {
        console.error('Paste error:', error);
      }
      
      setIsPasting(false);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addItem]);

  const renderItem = (item) => {
    const { id, type, content, position, size } = item;

    return (
      <Rnd
        key={id}
        default={{
          x: position.x,
          y: position.y,
          width: size.width,
          height: size.height,
        }}
        minWidth={100}
        minHeight={50}
        className="item-container"
        onDragStop={(e, d) => {
          updateItemPosition(id, { x: d.x, y: d.y });
        }}
      >
        <div className="item-content">
          {type === 'image' && (
            <img src={content} alt="Pasted content" className="pasted-image" />
          )}
          {type === 'text' && <div className="text-content">{content}</div>}
          {type === 'link' && (
            <a href={content} target="_blank" rel="noopener noreferrer" className="link-content">
              {content}
            </a>
          )}
        </div>
      </Rnd>
    );
  };

  return (
    <div className="canvas-container">
      <div className="instructions">
        <h1>Canvas Paste App</h1>
        <p>Press Ctrl+V to paste text, links, or images onto the canvas!</p>
        {isPasting && <div className="paste-indicator">Processing paste...</div>}
      </div>
      
      <div className="canvas">
        {items.map(renderItem)}
      </div>
    </div>
  );
}

export default App;