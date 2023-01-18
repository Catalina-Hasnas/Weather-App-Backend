# Aplicatia server Take Your Umbrella

Acest proiect era creat cu ajutorul [Express](https://expressjs.com/).

## Setup

Inainte de a porni aplicatia server, avem nevoie de configurat "secretele" prin crearea unui .env fisier, asemanator cu .env.example.\
Apoi inlocuim valorile dupa egal cu unele adevarate.
- ### `MONGODB_USER=<MONGODB_USER>`\
  username-ul folosit pentru conectare la baza de date mongodb
- ### `MONGODB_PASSWORD=<MONGODB_PASSWORD>`
  password-ul folosit pentru conectare la baza de date mongodb
- ### `WEATHER_API_KEY=<WEATHER_API_KEY>`
  Cheia API de la [WeatherAPI](https://www.weatherapi.com/).
- ### `ACCESS_TOKEN_SECRET=<ACCESS_TOKEN_SECRET>`
  Un sir lung de caractere folosit pentru generarea JWT

## Script-uri:

Scripturile trebuie rulate la un nivel cu package.json

- ### `npm install`  
  Pentru instalarea librariilor necesare
- ### `npm start`  
  Pentru pronirea proiectului

Aceasta comanda va rula proiectul in modul de dezvoltare 