import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import reportWebVitals from "./reportWebVitals";
import { init } from "d2";
import {HashRouter} from "react-router-dom";
import { Provider } from '@dhis2/app-runtime'
import LoadData from "./LoadData";

const basicAuth = "Basic " + btoa("atwabi:@Itwabi1234");

const appConfig = {
    baseUrl: 'https://ccdev.org/chistest/',
    apiVersion: 0,
    headers:{
        Authorization: basicAuth,
        "Content-Type": "application/json",
        withCredentials: true
    }
}

const developmentServer = "https://ccdev.org/chistest/api/";
const withBaseUrl = (baseUrl) => {
    init({
        baseUrl: baseUrl,
        headers: {
            Authorization: basicAuth,
            "Content-Type": "application/json",
            withCredentials: true
        },
    });
    ReactDOM.render(
        <Provider config={appConfig}>
            <HashRouter>
                <LoadData/>
            </HashRouter>
        </Provider>
        , document.getElementById("root"));
};
withBaseUrl(developmentServer);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
