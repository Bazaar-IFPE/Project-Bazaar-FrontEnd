import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";
import Header from "../../components/header/header";
import OtherFooter from "../../components/otherFooter/otherFooter";
import GridProduct from "./productGrid/gridProduct";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    
    if (query) {
      setSearchTerm(query);
      fetchResults(query);
    }
  }, [location.search]);

  const fetchResults = (query) => {
    axios
      .get(`http://localhost:8080/api/search`, { params: { query } })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Erro ao realizar a pesquisa:", error);
      });
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/searchPage?query=${encodeURIComponent(searchTerm)}`);
      fetchResults(searchTerm);
    } else if(searchTerm.trim() === "") {
      navigate(`/searchPage?query=${encodeURIComponent(searchTerm)}`);
      fetchResults(searchTerm);
    }
  };

  return (
    <div>
      <Header />
      <div className="background-search">
        <main style={{marginTop: '10vh', height: '100vh', marginBottom: '20px'}}>
          <div className="content-gridproducts">
            <br />
            <div className="input">
              <Input
                type="text"
                icon="search"
                placeholder="Digite aqui para pesquisar..."
                style={{ color: 'orange', margin: '0', width: '350px', height: '50%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>
          <br />
          <GridProduct searchTerm={searchTerm} results={results} />
        </main>
      </div>
      <OtherFooter />
    </div>
  );
}
