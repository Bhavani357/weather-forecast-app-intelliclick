# Weather-forecast-Application

## Setup:

1. Make sure you have [pnpm](https://pnpm.io/) installed on your system. If not, you can install it by running the following command:

   ```bash
   npm install -g pnpm
   ```

2. ```bash
      pnpm install
   ```
3. ```bash
      pnpm run dev
   ```

### Folder Structure

Here is the  folder structure of the Weather-forecast-app project:

```
weather-forecast-app/
│
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── citiesApi.ts            
│   ├── components/
│   │   ├── CityTable.tsx         
│   │   ├── SearchBar.tsx         
│   │   └──          
│   ├── context/
│   │   └── CitiesContext.tsx       
│   ├── hooks/
│   │   └── useCitySearch.ts  
│   ├── pages/
│   │   ├── CityWeather.tsx       
│   │   ├── Home.tsx     
│   ├── types/
│   │   └── city.ts          
│   |          
│   ├── App.css                   
│   ├── App.tsx                
│   ├── main.tsx                  
│   └── index.css              
├── .gitignore            
├── eslint.config.js                 
├── index.html                
└── package.json 
└── pnpm-lock.yaml 
└── README.md
└── tailwind.config.js
└── tsconfig.app.json
└── tsconfig.json
└── tsconfig.node.json
└── vite.config.ts                      

```