import axios from 'axios'

export default async (req, res) => {
    const {currency} = req.body
    const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${currency}`)
    const rates = {
        rub: currency === 'RUB' ? '1.00' : +response.data.rates['RUB'],
        usd: currency === 'USD' ? '1.00' : +response.data.rates['USD'],
        eur: currency === 'EUR' ? '1.00' : +response.data.rates['EUR'],
    }
    res.json({data: rates})
}
