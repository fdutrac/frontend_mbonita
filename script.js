$( document ).ready(function() {

    listarClientes();

    $("#botaoSalvar").click(function(){
        let dados = {
            "id": $("#id").val(),
            "name": $("#name").val(),
            "email": $("#email").val(),
            "birthday": $("#birthday").val(),
            "phone": $("#phone").val(),
            "address": $("#address").val(),
            "zip_code": $("#zip_code").val(),
            "address_ref": $("#address_ref").val()
        };
        salvarCliente(dados);
    });

    $("#botaoInserir").click(function(){
        limparForm();
    });

    $("#zip_code").focusout(function(){
        const cep = $(this).val();
        getEndereco(cep);
    });
});

const listarClientes = function(){
    var request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:3000/cliente', true)

    request.onload = function () {
        var clientes = JSON.parse(this.response);

        $("#tabelaClientes").empty();
        clientes.forEach(cliente => {
            $("#tabelaClientes").append(`<tr><td>${cliente.name}</td><td>${formatarData(cliente.birthday)}</td><td>${formatarTel(cliente.phone)}</td><td>${cliente.address}, CEP: ${formatarCep(cliente.zip_code)}</td><td>${cliente.email}</td><td><button type="button" class="btn btn-danger" onclick="deletarCliente(${cliente.id})">Excluir</button></td><td><button type="button" class="btn btn-primary" onclick="alterarCliente(${cliente.id})">Alterar</button></td></tr>`);
        });
    }
    request.send();
}

const deletarCliente = function(id){

    var request = new XMLHttpRequest()
    request.open('DELETE', 'http://localhost:3000/cliente', true)

    request.onload = function () {
        listarClientes();
    }

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({"id": id}));
}

const salvarCliente = function(dados){

    var request = new XMLHttpRequest()

    if (dados.id){
        request.open('PUT', `http://localhost:3000/cliente/${dados.id}`, true)
    } else {
        request.open('POST', 'http://localhost:3000/cliente', true)
    }

    request.onload = function () {
        listarClientes();
        $('#clienteModal').modal('hide');
        limparForm();
    }

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(dados));
}

const alterarCliente = function(id){

    var request = new XMLHttpRequest()
    request.open('GET', `http://localhost:3000/cliente/${id}`, true)

    request.onload = function () {
        var client = JSON.parse(this.response);

        $("#id").val(client[0].id);
        $("#name").val(client[0].name);
        $("#phone").val(client[0].phone);
        $("#email").val(client[0].email);
        $("#address").val(client[0].address);
        $("#zip_code").val(client[0].zip_code);
        $("#birthday").val(client[0].birthday.split("T")[0]);
        $("#address_ref").val(client[0].address_ref);

        $('#clienteModal').modal('show');
    }

    request.send(JSON.stringify({"id": id}));
}

const limparForm = function(){
    $("#id").val("");
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#address").val("");
    $("#zip_code").val("");
    $("#birthday").val("");
    $("#address_ref").val("");
}

const formatarData = function(data){
    const dataSemHora = data.split("T")[0];
    const dataInvertida = dataSemHora.split("-");
    return `${dataInvertida[2]}/${dataInvertida[1]}/${dataInvertida[0]}`;
}

const formatarCep = function(cep){
    return `${cep.substring(0,5)}-${cep.substring(5,8)}`;
}

const formatarTel = function(tel){
    return tel.replace(" ", "").replace("-", "").replace("(", "").replace(")", "");
}

function getEndereco(cep){
    if(cep != ""){

        var request = new XMLHttpRequest()
        request.open('GET', `http://viacep.com.br/ws/${cep}/json/`, true)

        request.onload = function () {
            var endereco = JSON.parse(this.response);
            $("#address").val(`${endereco.logradouro} - ${endereco.bairro} - ${endereco.localidade}-${endereco.uf}`);
        }
        request.send();

    }else{
        alert('Antes, preencha o campo CEP!')
    }
}
