// ignore_for_file: deprecated_member_use

import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:http/http.dart' as http;

Color main1 = Color(0xff0452aa);
Color main2 = Color(0xff030303);

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
      print(barcodeScanRes);
    } on PlatformException {
      barcodeScanRes = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    //if (barcodeScanRes != '-1')
    //  get lote == barcodeScanRes
    //  se sim: true
    //  se não: false                                            aqui
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => addProduto(prod, true))); //prod placeholder
    setState(() {
      _scanBarcode = barcodeScanRes;
    });
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
  addProduto(this.produto, this.LoteExistente);

  final Produto produto;
  final bool LoteExistente;

  @override
  State<addProduto> createState() => _addProdutoState(produto, LoteExistente);
}

class _addProdutoState extends State<addProduto> {
  _addProdutoState(this.produto, this.LoteExistente);
  final Produto produto;
  final bool LoteExistente;
  final input = TextEditingController();

  Widget _body = CircularProgressIndicator();
  String question = '';
  Widget buttons = Row();
  bool isEnabled = true;
  int? toAdd = 1;
  @override
  void initState() {
    if (!LoteExistente) {
      setState(() {
        buttons = addCancel();
        _body = produtoData();
      });
    } else
      setState(() {
        _body = sameLot();
      });
  }

  Widget sameLot() {
    return Scaffold(
      appBar: AppBar(backgroundColor: main1, title: Text("Aviso")),
      body: Center(
          child: Column(
        children: [
          Text("lote já registrado, deseja adicionar a ele?"),
          Row(
            children: [
              FlatButton(
                  onPressed: () {
                    setState(() {
                      buttons = addCancel();
                      _body = produtoData();
                    });
                  },
                  child: Text("Sim")),
              FlatButton(
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
        title: Text(produto.nome),
      ),
      body: Column(children: [
        Expanded(
          flex: 5,
          child: Image(
            image: AssetImage(produto.foto), // provavelmente terá q mudar
          ),
        ),
        Expanded(
            flex: 1, child: Text(produto.nome, style: TextStyle(fontSize: 32))),
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
                        produto.nome +
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
              //  se LoteExistente = true: patch estoque,  se false: Post Lote, get estoque, se existe produto: Patch estoque, se não: Post estoque
              changeButton(
                  false,
                  "adicionado " +
                      toAdd.toString() +
                      " " +
                      produto.nome +
                      "(s) com sucesso!",
                  end());
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

Produto prod = Produto("assets/Hat.png", 420, 69, "cool hat", 420.69,
    DateTime(2022, 05, 12), DateTime(3022, 05, 13), "Texas");

class Produto {
  String foto = '';
  int lote = 0;
  int id_produto = 0;
  String nome = '';
  double preco = 0.0;
  DateTime fabricacao = DateTime(0, 0, 0);
  DateTime validade = DateTime(0, 0, 0);
  String origem = '';

  Produto(String f, int l, int id, String n, double p, DateTime fab,
      DateTime val, String o) {
    foto = f;
    lote = l;
    id_produto = id;
    nome = n;
    preco = p;
    fabricacao = fab;
    validade = val;
    origem = o;
  }
}
