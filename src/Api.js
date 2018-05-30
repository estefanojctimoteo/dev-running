import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:3009/'
})

const apis = {
	loadTimezones: ()=> api.get('timezones')
}

export default apis