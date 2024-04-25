import { useEffect, useState } from "preact/hooks";
import { WeatherInfo } from "../WeatherData.ts";
import { Coordenada, Pais } from "../Data.ts";
import { FunctionComponent } from "https://esm.sh/v128/preact@10.19.6/src/index.js";

export const Weather: FunctionComponent = () => {
    const [pais, setPais] = useState<string>("Spain");
    const [ciudad, setCiudad] = useState<string>("Madrid");
    const [weatherData, setWeatherData] = useState<WeatherInfo>();
    const [showTemperature, setShowTemperature] = useState(true);
    const [showHumidity, setShowHumidity] = useState(true);
    const [showPrecipitation, setShowPrecipitation] = useState(true);
    const [showRain, setShowRain] = useState(true);
    const [paises, setPaises] = useState<Pais[]>([]);
    const [ciudades, setCiudades] = useState<string[]>([]);

    useEffect(() => {
        const handlerP = async () => {
            const respuesta = await fetch(`https://api.first.org/data/v1/countries/?region=europe`);
            const data = await respuesta.json();

            const paises:Pais[] = [];

            for (const key in data.data) {
                paises.push(data.data[key]);
            }

            setPaises(paises);
        }
        handlerP();
    }, [])

    useEffect(() => {
        const handlerCiudad = async () => {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({country: pais})
            });

            const data = await response.json();

            setCiudades(data.data);
        }
        
        handlerCiudad();
    }, [pais]);

    useEffect(() => {
        const fetchData = async () => {
            const API_KEY = "YoI1i7prCxxbrtaBCf7cHA==2EBcvxL2jprNPEiI";
            const ciu = `https://api.api-ninjas.com/v1/city?name=${ciudad}`;
            const result = await fetch(ciu, { 
                headers: {
                    "X-Api-Key": API_KEY
                }
            });
            const data = await result.json();
            const coordenada: Coordenada = { lat: data[0].latitude, lon: data[0].longitude };
            
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordenada.lat}&longitude=${coordenada.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain&hourly=&forecast_days=1`);
            const weatherData = await response.json();
            
            const weatherInfo: WeatherInfo = {
                time: weatherData.current.time,
                temperature_2m: weatherData.current.temperature_2m,
                relative_humidity_2m: weatherData.current.relative_humidity_2m,
                precipitation: weatherData.current.precipitation,
                rain: weatherData.current.rain,
                temperature_2mUnits: weatherData.current_units.temperature_2m,
                relative_humidity_2mUnits: weatherData.current_units.relative_humidity_2m,
                precipitationUnits: weatherData.current_units.precipitation,
                rainUnits: weatherData.current_units.rain
            };

            setWeatherData(weatherInfo);
        };

        if (ciudad) {
            fetchData();
        }
    }, [ciudad]);

    return (
        <div className="container">
            <h2>Ver Tiempo</h2>
            <select value={pais} onChange={(e) => setPais(e.currentTarget.value)}>
                <option value="">Selecciona un país</option>
                {paises.map((pais) => (
                    <option value={pais.country}>{pais.country}</option>
                ))}
            </select>
            <select value={ciudad} onChange={(e) => setCiudad(e.currentTarget.value)}>
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                    <option value={ciudad}>{ciudad}</option>
                ))}
            </select>
            <div>
                <button onClick={() => setShowTemperature(!showTemperature)}>
                    Temperatura
                </button>
                <button onClick={() => setShowHumidity(!showHumidity)}>Humedad</button>
                <button onClick={() => setShowPrecipitation(!showPrecipitation)}>
                    Precipitación
                </button>
                <button onClick={() => setShowRain(!showRain)}>Lluvia</button>
            </div>
            <div>
                {weatherData && showTemperature && (
                    <p>
                        Temperatura: {weatherData.temperature_2m}{" "}
                        {weatherData.temperature_2mUnits}
                    </p>
                )}
                {weatherData && showHumidity && (
                    <p>
                        Humedad: {weatherData.relative_humidity_2m}{" "}
                        {weatherData.relative_humidity_2mUnits}
                    </p>
                )}
                {weatherData && showPrecipitation && (
                    <p>
                        Precipitación: {weatherData.precipitation}{" "}
                        {weatherData.precipitationUnits}
                    </p>
                )}
                {weatherData && showRain && (
                    <p>
                        Lluvia: {weatherData.rain} {weatherData.rainUnits}
                    </p>
                )}
            </div>
        </div>
    );
};
