import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";
import React, { useEffect } from "react";
import { initializeDatabase } from './Crud.js';



export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

    return (
            <NavigationContainer>
                <Tabs />
            </NavigationContainer>
    );
}
