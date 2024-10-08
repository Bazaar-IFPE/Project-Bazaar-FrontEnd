/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Image,
  Input,
  Modal,
  Table,
} from "semantic-ui-react";
import OtherFooter from "../../components/otherFooter/otherFooter";
import HeaderComponent from "../../components/otherHeader/otherHeader";
import { AuthContext } from "../../context/AuthContext";
import { notifySuccess } from "../../views/util/Util";
import EditProduct from "./EditProduct/EditProduct";

export default function ListProductPage() {
  const [lista, setLista] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [idRemover, setIdRemover] = useState();
  const [titulo, setTitulo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const atualizarListaProduto = () => {
    navigate(0);
  };

  const carregarLista = useCallback(async () => {
    if (!authState.token) {
      console.log("Token não carregado ainda");
    }
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/produto/usuario/${authState.userId}`,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );

      if (response.status === 200) {
        setTimeout(() => {
          setLista(response.data || []);
          setFilteredList(response.data || []);
        }, 500)
      } else {
        console.error("Erro ao carregar a lista");
        setLista([]);
        setFilteredList([]);
      }
    } catch (error) {
      console.error("Falha ao receber os dados", error);
    }
  }, []);

  useEffect(() => {
    carregarLista();
  }, [lista]);

  const handleFilter = () => {
    const filtered = lista.filter(
      (produto) =>
        (titulo ? produto.titulo.includes(titulo) : true) &&
        (codigo ? produto.codigo.includes(codigo) : true) &&
        (valorUnitario
          ? produto.valorUnitario.toString().includes(valorUnitario)
          : true) &&
        (descricao ? produto.descricao.includes(descricao) : true)
    );
    setFilteredList(filtered);
  };

  const remover = async () => {
    await axios
      .delete(`http://localhost:8080/api/produto/${idRemover}`)
      .then((response) => {
        notifySuccess("Produto removido com sucesso.");
        carregarLista(); // Recarregar a lista de produtos após remoção
      })
      .catch((error) => {
        console.log("Erro ao remover o produto.", error);
      });
    setOpenModal(false);
  };

  const editarProduto = async (produtoId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/produto/${produtoId}`
      );
      if (response.status === 200) {
        setProdutoSelecionado(response.data);
        setOpenModalEdit(true);
      } else {
        console.error("Erro ao buscar dados do produto específico!");
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição: ", error);
    }
  };

  return (
    <div>
      <HeaderComponent />
      <div style={{ marginTop: "8%", marginBottom: '6%' }}>
        <Container textAlign="justified" style={{ height: "100vh"}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1> Produtos </h1>
            <div>
              <Button color="orange" as={Link} to="/listVendas">
                Minhas Vendas
              </Button>

              <Button
                color="orange"
                as={Link}
                to="/listCompras"
                style={{ margin: "0 30px" }}
              >
                Minhas Compras
              </Button>

              <Button
                label="Cadastrar Produto"
                color="orange"
                circular
                icon="clipboard outline"
                floated="right"
                as={Link}
                to="/formProduct"
              ></Button>
            </div>
          </div>

          <Divider />

          <div style={{ marginTop: "5%" }}>
            <div style={{ marginBottom: "20px" }}>
              <Input
                placeholder="Título"
                style={{ width: "300px" }}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <Input
                placeholder="Código"
                style={{ width: "300px", marginLeft: "10px" }}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <Input
                placeholder="Valor Unitário"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                style={{ width: "250px", marginLeft: "10px" }}
              />
              <Button
                color="blue"
                onClick={handleFilter}
                style={{ marginLeft: "10px" }}
              >
                Filtrar
              </Button>

              <Button
                color="green"
                onClick={atualizarListaProduto}
                style={{ marginLeft: "40px" }}
              >
                Atualizar
              </Button>
            </div>

            <div style={{ flex: 1, zIndex: "-1", height: 'calc(100vh - 10vh)', overflow: 'auto' }}>
              <Table color="orange" sortable celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Imagem</Table.HeaderCell>
                    <Table.HeaderCell>Código</Table.HeaderCell>
                    <Table.HeaderCell>Título</Table.HeaderCell>
                    <Table.HeaderCell>Descrição</Table.HeaderCell>
                    <Table.HeaderCell>Valor Unitário</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Ações
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredList.length > 0 ? (
                    filteredList.map((produto) => (
                      <Table.Row key={produto.id}>
                        <Table.Cell>
                          <Image
                            src={produto.imagem ? `http://localhost:8080/static/uploaded-imgs/${produto.imagem}` : ''}
                            size="small"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "fill",
                              borderRadius: '5px'
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell>{produto.codigo}</Table.Cell>
                        <Table.Cell width={3}>{produto.titulo}</Table.Cell>
                        <Table.Cell>{produto.descricao}</Table.Cell>
                        <Table.Cell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorUnitario)}</Table.Cell>
                        <Table.Cell textAlign="center" width={2}>
                          <Button
                            inverted
                            circular
                            color="green"
                            title="Clique aqui para editar os dados deste produto"
                            icon
                            onClick={() => {
                              editarProduto(produto.id);
                            }}
                          >
                            <Icon name="edit" />
                          </Button>{" "}
                          <Button
                            inverted
                            circular
                            color="red"
                            title="Clique aqui para remover este produto"
                            icon
                            onClick={() => {
                              setIdRemover(produto.id);
                              setOpenModal(true);
                            }}
                          >
                            <Icon name="trash" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan="6" textAlign="center">
                        Nenhum produto encontrado.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
          </div>
        </Container>
      </div>
      <OtherFooter />
      <Modal
        basic
        onClose={() => setOpenModalEdit(false)}
        onOpen={() => setOpenModalEdit(true)}
        open={openModalEdit}
      >
        <EditProduct
          produto={produtoSelecionado}
          onCloseModal={() => setOpenModalEdit(!openModalEdit)}
        />
      </Modal>
      <Modal
        basic
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
        open={openModal}
      >
        <Header icon>
          <Icon name="trash" />
          <div style={{ marginTop: "5%" }}>
            Tem certeza que deseja remover esse registro?
          </div>
        </Header>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setOpenModal(false)}
          >
            <Icon name="remove" /> Não
          </Button>
          <Button color="green" inverted onClick={() => remover()}>
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
