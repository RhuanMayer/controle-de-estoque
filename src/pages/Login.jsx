import { useState } from 'react';
import { supabase } from '../../backend/client/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Método correto para autenticação no Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Obter informações adicionais do usuário
      const { data: userData } = await supabase
        .from('profiles') // ou sua tabela de usuários
        .select('company_id, is_admin')
        .eq('id', data.user.id)
        .single();

      // Definir company_id no contexto da sessão (se necessário)
      if (userData?.company_id) {
        await supabase.rpc('set_current_company', { company_id: userData.company_id });
      }

      // Redirecionar para dashboard
      window.location.href = userData?.company_id 
        ? `/inicio/${userData.company_id}`
        : '/inicio';
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginTop: '50px'
    }}>
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};
export default Login;