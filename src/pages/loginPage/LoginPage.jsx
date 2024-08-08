import React, { useState } from "react";
import { Form, Input, FormField, Icon, Button, Loader} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./LoginPage.css";
import axios from "axios";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  function salvar() {

    let user = {
      username: login,
      password: senha
    }

    setLoading(true);
    axios.post('http://localhost:8080/api/usuario/login', user)
     .then((response) => {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('login', response.data.login);
        setLoading(false);
        toast.success(
          "Logado com Sucesso!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        setLogin('');
        setSenha('');
        navigation('/')
     })
     .catch((error) => {
      toast.error(
        "Login ou senha Inválidos!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      setLoading(false);
      setLogin('');
      setSenha('');
      });
  }

  return (
    <div>
      <Header />
      <div className="container-login">
        <div className="background-login">
          <div className="content-login">
            <h1>Acesse a sua Conta</h1>
            <div className="form-content-login">
              <Form widths="equal" size="large">
                <FormField>
                  <label>Usuário</label>
                  <Input
                    iconPosition="left"
                    placeholder="usuario"
                    type="text"
                    style={{ margin: "0" }}
                  >
                    <Icon name="user" />
                    <input
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                    />
                  </Input>
                </FormField>
                <FormField>
                  <label>Senha</label>
                  <Input
                    iconPosition="left"
                    placeholder="Senha"
                    type="password"
                    style={{ margin: "0" }}
                  >
                    <Icon name="lock" />
                    <input
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </Input>
                </FormField>
              </Form>
              <Button
                color="orange"
                circular
                size="medium"
                style={{ color: "black", marginTop: "5%" }}
                onClick={() => salvar()}
              >
                {loading ? (
                  <Loader active inline inverted size="tiny" />
                ) : (
                  <span style={{color: 'black'}}>Entrar</span>
                )}
              </Button>
            </div>
            <div className="haveAcount">
              <p>Não tem uma conta?</p>
              <Link to={"/register"}>Cadastre-se</Link>
            </div>
            <span className="forgotPassword"><Link to={"/forgotPassword"} style={{color: 'red'}}>Esqueceu sua senha?</Link></span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
