import axios from "axios";

export default async (req, res) => {
    const {alias} = req.body
    let code = ''
    if (alias === 'Rome') {
        code = ',it'
    }
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${alias}${code}&appid=1109b48618534ed665975c9d804a3d5f`)
    const c = response.data.main.temp
    const result = c - 273.15
    res.json({
        data: {
            cords: {
                lon: response.data.coord.lon,
                lat: response.data.coord.lat,
            },
            temp: +result.toFixed(1),
            wind: response.data.wind.speed
        }
    })
}
