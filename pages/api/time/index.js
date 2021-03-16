import axios from "axios";

export default async (req, res) => {
    const {lon,lat} = req.body
    const response = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=836L9RXMDBSI&format=json&by=position&lat=${lat}&lng=${lon}`)
    res.json({data: response.data.formatted})
}
