import { useState } from 'react';
import gitLogo from '../assets/github.png';
import Input from '../components/Input';
import Button from '../components/Button';
import ItemRepo from '../components/ItemRepo';
import { api } from '../services/api';


import { Container } from './styles'
function App() {

  const [currentRepo, setCurrentRepo] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchRepo = async () => {

    if (!currentRepo) {
      alert('Informe o repositório no formato "usuario/repositorio".');
      return;
    }

    setLoading(true);

    try {

      const {data} = await api.get(`repos/${currentRepo}`)
      
      if(data.id) {
        
        const isExist = repos.find(repo => repo.id === data.id)
        
        if(!isExist) {
          setRepos(prev => [...prev, data]);
          setCurrentRepo('')
          return
        }
      }

    }catch (error){
      if (error.response?.status === 404) {
        alert('Repositório não encontrado.');
      } else {
        alert('Ocorreu um erro ao buscar o repositório. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveRepo = (id) => {
    const newRepos = repos.filter(repo => repo.id !== id);
      setRepos(newRepos);
  }


  return (
    <Container>
      
      <img src={gitLogo} width={72} height={72} alt='Logo do Github'/>
      <Input value={currentRepo} onChange={(e) => setCurrentRepo(e.target.value)} />
      <Button onClick={handleSearchRepo} disabled={loading} />
      {repos.map(repo => (
        <ItemRepo
          key={repo.id}
          handleRemoveRepo={handleRemoveRepo}
          repo={repo}
        />
      ))}
      
    
    </Container>
  );
}

export default App;
