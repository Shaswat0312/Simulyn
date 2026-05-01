import axios from 'axios'

const API = 'http://localhost:8000/api/v1'

export const runSimulation = (config) => 
  axios.post(`${API}/simulate`, config)

export const getSimulations = () => 
  axios.get(`${API}/simulations`)

export const getSimulation = (id) => 
  axios.get(`${API}/simulations/${id}`)