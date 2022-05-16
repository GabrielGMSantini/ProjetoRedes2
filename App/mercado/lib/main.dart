// ignore_for_file: deprecated_member_use

import 'dart:convert';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:http/http.dart' as http;

Color main1 = Color(0xff0452aa);
Color main2 = Color(0xff030303);

class QRdata {
  final int ID_LOTE;
  final DateTime Data_Fabricacao;
  final DateTime Data_Validade;
  final String Origem;
  final int ID_PRODUTO;
  final String Nome_Produto;
  final double Preco_Produto;
  final int QntMin;

  const QRdata({
    required this.ID_LOTE,
    required this.Data_Fabricacao,
    required this.Data_Validade,
    required this.Origem,
    required this.ID_PRODUTO,
    required this.Nome_Produto,
    required this.Preco_Produto,
    required this.QntMin,
  });

  factory QRdata.fromJson(Map<String, dynamic> json) {
    return QRdata(
        ID_LOTE: json['ID_LOTE'],
        Data_Fabricacao: DateTime.parse(json['Data_Fabricacao']),
        Data_Validade: DateTime.parse(json['Data_Validade']),
        Origem: json['Origem'],
        ID_PRODUTO: json['ID_PRODUTO'],
        Nome_Produto: json['Nome_Produto'],
        Preco_Produto: json['Preco_Produto'],
        QntMin: json['QntMin']);
  }
}

class Produto {
  final int ID;
  final String nome;
  final double preco;
  final int qtdTotal;
  final int qtdMin;

  const Produto({
    required this.ID,
    required this.nome,
    required this.preco,
    required this.qtdTotal,
    required this.qtdMin,
  });

  factory Produto.fromJson(Map<String, dynamic> json) {
    return Produto(
        ID: json['ID_PRODUTO'],
        nome: json['Nome'],
        preco: json['Preco'],
        qtdTotal: json['QntTotal'],
        qtdMin: json['QntMin']);
  }
}

class Lote {
  final int ID;
  final int id_produto;
  final DateTime fabricacao;
  final DateTime validade;
  final String origem;

  const Lote({
    required this.ID,
    required this.id_produto,
    required this.fabricacao,
    required this.validade,
    required this.origem,
  });
  factory Lote.fromJson(Map<String, dynamic> json) {
    return Lote(
        ID: json['ID_LOTE'],
        id_produto: json['fk_Produtos_ID_PRODUTO'],
        fabricacao: DateTime.parse(json['Data_Fabricacao']),
        validade: DateTime.parse(json['Data_Validade']),
        origem: json['Origem']);
  }
}

Future<Lote?> GetLote(int id) async {
  final response =
      await http.get(Uri.parse('http://10.0.2.2:3000/lotes/' + id.toString()));
  if (response.statusCode == 200) {
    if (jsonDecode(response.body)['estoque'].isNotEmpty)
      return Lote.fromJson(jsonDecode(response.body)['estoque'][0]);
    else
      return null;
  } else {
    throw Exception("falha em carregar o lote");
  }
}

Future<http.Response> PostLote(Lote lote) {
  return http.post(Uri.parse("http://10.0.2.2:3000/lotes"),
      headers: {"Content-type": "application/json"},
      body: jsonEncode(<String, dynamic>{
        'id_produto': lote.id_produto,
        'id_lote': lote.ID,
        'data_fabricacao': lote.fabricacao.toString(),
        'data_validade': lote.validade.toString(),
        'origem': lote.origem,
      }));
}

Future<Produto?> GetProduto(int id) async {
  final response = await http.get(Uri.parse('http://10.0.2.2:3000/produtos/' +
      id.toString())); // 10.0.2.2 é o localhost pro emulador
  if (response.statusCode == 200) {
    print(jsonDecode(response.body).toString());
    if (jsonDecode(response.body)['produto'].isNotEmpty)
      return Produto.fromJson(jsonDecode(response.body)['produto'][0]);
    else
      return null;
  } else {
    throw Exception("falha em carregar o lote");
  }
}

Future<http.Response> PostProduto(Produto produto) {
  return http.post(Uri.parse("http://10.0.2.2:3000/produtos"),
      headers: {"Content-type": "application/json"},
      body: jsonEncode(<String, dynamic>{
        'id_produto': produto.ID,
        'nome': produto.nome,
        'preco': produto.preco,
        'qntTotal': produto.qtdTotal,
        'qntMin': produto.qtdMin,
      }));
}

Future<http.Response> PatchProduto(int id, int qtd) {
  return http.patch(Uri.parse("http://10.0.2.2:3000/produtos"),
      headers: {"Content-type": "application/json"},
      body: jsonEncode(<String, dynamic>{
        'id_produto': id,
        'qntTotal': qtd,
      }));
}

void main() {
  runApp(MaterialApp(home: BarcodeReader()));
}

class BarcodeReader extends StatefulWidget {
  const BarcodeReader({Key? key}) : super(key: key);

  @override
  State<BarcodeReader> createState() => _reader();
}

class _reader extends State<BarcodeReader> {
  String _scanBarcode = 'Unknown';

  @override
  void initState() {
    super.initState();
  }

  Future<void> scanBarcodeNormal() async {
    String barcodeScanRes;
    // Platform messages may fail, so we use a try/catch PlatformException.
    try {
      barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
          '#ff6666', 'Cancel', true, ScanMode.QR);
    } on PlatformException {
      barcodeScanRes = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    if (barcodeScanRes != '-1') {
      //  get lote == barcodeScanRes
      //  se sim: true
      //  se não: false                                            aqui

      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => addProduto(QRdata.fromJson(
                  jsonDecode(barcodeScanRes))))); //prod placeholder
      setState(() {
        _scanBarcode = barcodeScanRes;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
            appBar: AppBar(
              title: const Text('Barcode scan'),
              backgroundColor: main1,
            ),
            body: Container(
                alignment: Alignment.center,
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      FlatButton(
                          color: main1,
                          onPressed: () => scanBarcodeNormal(),
                          child: Text(
                            'Adicionar Produto',
                            style: TextStyle(color: Color(0xffffffff)),
                          )),
                      Text('Scan result : $_scanBarcode\n',
                          style: TextStyle(fontSize: 20))
                    ]))));
  }
}

class addProduto extends StatefulWidget {
  addProduto(this.data);

  final QRdata data;

  @override
  State<addProduto> createState() => _addProdutoState(data);
}

class _addProdutoState extends State<addProduto> {
  _addProdutoState(this.data);
  final QRdata data;
  final input = TextEditingController();

  Widget _body = CircularProgressIndicator();
  String question = '';
  Widget buttons = Row();
  bool isEnabled = true;
  bool loteExistente = false;
  int? toAdd = 1;

  @override
  void initState() {
    GetLote(data.ID_LOTE).then((value) {
      if (value == null) {
        setState(() {
          buttons = addCancel();
          _body = produtoData();
        });
      } else {
        loteExistente = true;
        setState(() {
          _body = sameLot();
        });
      }
    });
  }

  Widget sameLot() {
    return Scaffold(
      appBar: AppBar(backgroundColor: main1, title: Text("Aviso")),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Text("lote já registrado, deseja adicionar ele?",
              style: TextStyle(fontSize: 22)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              FlatButton(
                  color: main1,
                  textColor: Colors.white,
                  onPressed: () {
                    setState(() {
                      buttons = addCancel();
                      _body = produtoData();
                    });
                  },
                  child: Text("Sim")),
              FlatButton(
                  color: main1,
                  textColor: Colors.white,
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text("Não"))
            ],
          )
        ],
      )),
    );
  }

  Widget produtoData() {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: main1,
        title: Text("Adicionar: " + data.Nome_Produto),
      ),
      body: Column(children: [
        /* Expanded(
          flex: 5,
          child: Image(
            image: AssetImage(produto.foto), // provavelmente terá q mudar
          ),
        ), */
        Expanded(
            flex: 1,
            child: Text(data.Nome_Produto, style: TextStyle(fontSize: 32))),
        Expanded(
            flex: 1,
            child: TextField(
              enabled: isEnabled,
              controller: input,
              decoration: InputDecoration(labelText: "Quantos a adicionar"),
              keyboardType: TextInputType.number,
              inputFormatters: <TextInputFormatter>[
                FilteringTextInputFormatter.digitsOnly
              ],
            )),
        Expanded(
            flex: 1,
            child: Text(
              question,
              style: TextStyle(fontSize: 16),
            )),
        Expanded(flex: 1, child: buttons)
      ]),
    );
  }

  Widget addCancel() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        FlatButton(
            color: main1,
            textColor: Colors.white,
            onPressed: () {
              if (int.tryParse(input.text) != null) {
                toAdd = int.parse(input.text);
                changeButton(
                    false,
                    "adicionar " +
                        toAdd.toString() +
                        " " +
                        data.Nome_Produto +
                        "(s)?",
                    confirm());
              } else {
                setState(() {
                  question = "valor inválido";
                  _body = produtoData();
                });
              }
            },
            child: Text("Adicionar")),
        FlatButton(
            color: main1,
            textColor: Colors.white,
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text("Cancelar")),
      ],
    );
  }

  Widget confirm() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        FlatButton(
            color: main1,
            textColor: Colors.white,
            onPressed: () {
              //Post Lote se não existe, get produtos, se existe produto: Patch produto, se não: Post produto

              setState(() {
                buttons = CircularProgressIndicator();
              });

              GetProduto(data.ID_PRODUTO).then(((value) {
                handleProduct(value).then((value) {
                  if (!loteExistente) {
                    print("lote post");
                    PostLote(Lote(
                        ID: data.ID_LOTE,
                        id_produto: data.ID_PRODUTO,
                        fabricacao: data.Data_Fabricacao,
                        validade: data.Data_Validade,
                        origem: data.Origem));
                  }
                }).then((value) {
                  changeButton(
                      false,
                      "adicionado " +
                          toAdd.toString() +
                          " " +
                          data.Nome_Produto +
                          "(s) com sucesso!",
                      end());
                });
              }));
            },
            child: Text("Sim")),
        FlatButton(
            color: main1,
            textColor: Colors.white,
            onPressed: () {
              changeButton(true, '', addCancel());
            },
            child: Text("Não")),
      ],
    );
  }

  Widget end() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        FlatButton(
            color: main1,
            textColor: Colors.white,
            onPressed: (() {
              Navigator.pop(context);
            }),
            child: Text("Voltar"))
      ],
    );
  }

  handleProduct(Produto? value) async {
    if (value == null) {
      print("produto post");
      return PostProduto(Produto(
          ID: data.ID_PRODUTO,
          nome: data.Nome_Produto,
          preco: data.Preco_Produto,
          qtdTotal: int.parse(toAdd.toString()),
          qtdMin: data.QntMin));
    } else {
      print("produto patch");
      return PatchProduto(
          data.ID_PRODUTO, value.qtdTotal + int.parse(toAdd.toString()));
    }
  }

  void changeButton(bool allowInput, String q, Widget newButtons) {
    setState(() {
      isEnabled = allowInput;
      question = q;
      buttons = newButtons;
      _body = produtoData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return _body;
  }
}
