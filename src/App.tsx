import './App.css'
import Controller from './components/controller/controller';
import Map from './components/map/map';

function App() {
  return (
    <div className='h-screen w-screen p-12'>
      <Map />
      <Controller />
    </div>
  );
}

export default App