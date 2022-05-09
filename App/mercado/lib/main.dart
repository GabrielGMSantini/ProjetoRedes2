// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';

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
          '#ff6666', 'Cancel', true, ScanMode.BARCODE);
      print(barcodeScanRes);
    } on PlatformException {
      barcodeScanRes = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => addProduto("2222")));
    setState(() {
      _scanBarcode = barcodeScanRes;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
            appBar: AppBar(title: const Text('Barcode scan')),
            body: Builder(builder: (BuildContext context) {
              return Container(
                  alignment: Alignment.center,
                  child: Flex(
                      direction: Axis.vertical,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        ElevatedButton(
                            onPressed: () => scanBarcodeNormal(),
                            child: Text('Adicionar Produto')),
                        /*  ElevatedButton(
                            onPressed: () => startBarcodeScanStream(),
                            child: Text('Start barcode scan stream')),*/
                        Text('Scan result : $_scanBarcode\n',
                            style: TextStyle(fontSize: 20))
                      ]));
            })));
  }
}

class addProduto extends StatefulWidget {
  addProduto(this.code);

  final String code;

  @override
  State<addProduto> createState() => _addProdutoState(code);
}

class _addProdutoState extends State<addProduto> {
  _addProdutoState(this.code);
  final String code;
  final input = TextEditingController();

  Widget _body = CircularProgressIndicator();
  String question = '';
  Widget buttons = Row();
  bool isEnabled = true;
  int toAdd = 0;
  Produto p = Produto('', '');
  @override
  void initState() {
    //usa code pra pegar o produto do bd
    // e ent, carrega a pg do produto
    setState(() {
      p = prod;
      buttons = addCancel();
      _body = produtoData();
      // placeholder
    });
  }

  Widget produtoData() {
    return Scaffold(
      appBar: AppBar(
        title: Text(p.nome),
      ),
      body: Column(children: [
        Expanded(
          flex: 5,
          child: Image(
            image: AssetImage(p.foto), // provavelmente terá q mudar
          ),
        ),
        Expanded(flex: 2, child: Text(p.nome)),
        Expanded(
            flex: 2,
            child: TextField(
              enabled: isEnabled,
              controller: input,
              decoration: InputDecoration(labelText: "Quantos a adicionar"),
              keyboardType: TextInputType.number,
              inputFormatters: <TextInputFormatter>[
                FilteringTextInputFormatter.digitsOnly
              ], // Only numbers can be entered
            )),
        Expanded(flex: 1, child: Text(question)),
        Expanded(flex: 1, child: buttons)
      ]),
    );
  }

  Widget addCancel() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        FlatButton(
            onPressed: () {
              toAdd = int.parse(input.text);
              changeButton(
                  false,
                  "adicionar " + toAdd.toString() + " " + p.nome + "(s)",
                  confirm());
            },
            child: Text("Adicionar")),
        FlatButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text("Cancelar")),
      ],
    );
  }

  Widget confirm() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        FlatButton(
            onPressed: () {
              // atualizar banco de dados
              changeButton(
                  false,
                  "adicionado " +
                      toAdd.toString() +
                      " " +
                      p.nome +
                      "(s) com sucesso!",
                  end());
            },
            child: Text("Sim")),
        FlatButton(
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

Produto prod = Produto("assets/Hat.png", "cool hat");

class Produto {
  String foto = '';
  String nome = '';

  Produto(String f, String n) {
    foto = f;
    nome = n;
  }
}
