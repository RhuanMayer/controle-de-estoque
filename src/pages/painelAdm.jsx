import { useState } from 'react'
import { supabase } from '../../backend/client/supabaseClient'

export function CreateCompany() {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // 1. Criar a empresa na tabela public.companies
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName }])
        .select()
        .single()

      if (companyError) throw companyError

      // 2. Criar schema para a nova empresa (via função RPC)
      const { error: schemaError } = await supabase
        .rpc('create_company_schema', {
          company_id: company.id,
          schema_name: `company_${company.id.replace(/-/g, '_')}`
        })

      if (schemaError) throw schemaError

      setSuccess(true)
      setCompanyName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Criar Nova Empresa</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Empresa criada com sucesso!</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Nome da empresa"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Empresa'}
        </button>
      </form>
    </div>
  )
}