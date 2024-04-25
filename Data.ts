export type Coordenada = {
    lat: string,
    lon: string
}

export type Pais = {
    country: string,
    region: string
}

export type Data = {
    [key: string]: Pais
}
