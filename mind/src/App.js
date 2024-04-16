import './App.css';
import Object from './obj'

function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      
    <Object/>


    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'grey',
        zIndex: 1, // Ensure the content is rendered on top of the 3D scene
      }}>
        <h1>Plant a Tree</h1>
      </div>
      
    </div>
  );
}

export default App;
