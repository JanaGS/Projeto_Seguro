import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [modoSeguroAtivo, setModoSeguroAtivo] = useState<boolean>(false);
  const [contato1, setContato1] = useState<string>('');
  const [contato2, setContato2] = useState<string>('');
  const [loadingGps, setLoadingGps] = useState<boolean>(false);
  const [abrirDelegacia, setAbrirDelegacia] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Aviso de Segurança", "A permissão de GPS é necessária para o funcionamento do botão SOS.");
      }
    })();
  }, []);

  const handlePress = (index: number) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const ativarModoSeguro = () => {
    setModoSeguroAtivo(true);
    Alert.alert("Acesso Autorizado", "Modo de segurança oculto ativado com sucesso!");
  };

  const dispararGpsEmergencia = async () => {
    setLoadingGps(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const linkMapa = `https://google.com{latitude},${longitude}`;
      
      Alert.alert(
        "🚨 SOS ENVIADO", 
        `Localização capturada!\n\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nLink gerado para a rede de apoio:\n${linkMapa}`
      );
    } catch (error) {
      Alert.alert("Erro de GPS", "Não foi possível obter a sua geolocalização atual.");
    } finally {
      setLoadingGps(false);
    }
  };

  const winner = calculateWinner(board);
  const status = winner ? `Vitória: ${winner}` : `Próximo: ${isXNext ? 'X' : 'O'}`;

  // --- INTERFACE 3: WEBVIEW GOVERNAMENTAL ANÔNIMA ---
  if (abrirDelegacia) {
    return (
      <View style={styles.containerWebView}>
        <View style={styles.headerWebView}>
          <Text style={styles.headerWebViewTitle}>Delegacia Virtual Segura</Text>
          <TouchableOpacity style={styles.closeBOButton} onPress={() => setAbrirDelegacia(false)}>
            <Text style={styles.closeBOText}>Fechar e Voltar</Text>
          </TouchableOpacity>
        </View>
        <WebView 
          source={{ uri: 'https://sinesp.gov.br' }} 
          style={{ flex: 1 }}
          incognito={true} 
          cacheEnabled={false}
        />
      </View>
    );
  }

  // --- INTERFACE 2: TELA OCULTA ---
  if (modoSeguroAtivo) {
    return (
      <View style={[styles.container, { backgroundColor: '#111' }]}>
        <Text style={styles.alertTitle}>PAINEL DE SUPORTE</Text>
        <Text style={styles.alertSubtitle}>Configure seus contatos de emergência locais</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Celular do Contato de Confiança 1:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="(00) 00000-0000" 
            placeholderTextColor="#666"
            value={contato1}
            onChangeText={setContato1}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Celular do Contato de Confiança 2:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="(00) 00000-0000" 
            placeholderTextColor="#666"
            value={contato2}
            onChangeText={setContato2}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={[styles.panicButton, loadingGps && { opacity: 0.6 }]} 
          onPress={dispararGpsEmergencia}
          disabled={loadingGps}
        >
          {loadingGps ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.panicButtonText}>SOS</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.boButton} onPress={() => setAbrirDelegacia(true)}>
          <Text style={styles.boButtonText}>📝 Registrar Ocorrência Online (BO)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => setModoSeguroAtivo(false)}>
          <Text style={styles.backButtonText}>Voltar para o Jogo (Disfarce)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- INTERFACE 1: JOGO DA VELHA (DISFARCE) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha Pro</Text>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {board.map((value, index) => (
          <TouchableOpacity key={index} style={styles.square} onPress={() => handlePress(index)}>
            <Text style={[styles.squareText, value === 'X' ? styles.colorX : styles.colorO]}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Reiniciar Partida</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Pressable delayLongPress={3000} onLongPress={ativarModoSeguro}>
          <Text style={styles.footerText}>Versão: v1.0.42 (Build Acadêmica)</Text>
        </Pressable>
      </View>
    </View>
  );
}

// CORREÇÃO DOS ERROS: Retornando apenas a string da letra vencedora ('X' ou 'O')
function calculateWinner(squares: (string | null)[]): string | null {
  if (squares[0] && squares[0] === squares[1] && squares[0] === squares[2]) return squares[0];
  if (squares[3] && squares[3] === squares[4] && squares[3] === squares[5]) return squares[3];
  if (squares[6] && squares[6] === squares[7] && squares[6] === squares[8]) return squares[6];
  if (squares[0] && squares[0] === squares[3] && squares[0] === squares[6]) return squares[0];
  if (squares[1] && squares[1] === squares[4] && squares[1] === squares[7]) return squares[1];
  if (squares[2] && squares[2] === squares[5] && squares[2] === squares[8]) return squares[2];
  if (squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) return squares[0];
  if (squares[2] && squares[2] === squares[4] && squares[2] === squares[8]) return squares[2];
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  status: { fontSize: 18, marginBottom: 20, color: '#666' },
  board: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#ccc', borderWidth: 2, borderColor: '#333' },
  square: { width: '33.33%', height: '33.33%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  squareText: { fontSize: 40, fontWeight: 'bold' },
  colorX: { color: '#007AFF' },
  colorO: { color: '#FF3B30' },
  resetButton: { marginTop: 30, backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  resetText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { position: 'absolute', bottom: 30 },
  footerText: { fontSize: 12, color: '#bbb', textAlign: 'center' },
  alertTitle: { fontSize: 26, fontWeight: 'bold', color: '#FF3B30', marginBottom: 5 },
  alertSubtitle: { fontSize: 14, color: '#aaa', marginBottom: 30, textAlign: 'center' },
  form: { width: '100%', paddingHorizontal: 20, marginBottom: 20 },
  label: { color: '#fff', fontSize: 14, marginBottom: 5 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 6, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  panicButton: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  panicButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  backButton: { padding: 10 },
  backButtonText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' },
  boButton: { backgroundColor: '#444', width: '90%', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 25 },
  boButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  containerWebView: { flex: 1, backgroundColor: '#fff' },
  headerWebView: { height: 70, paddingTop: 25, backgroundColor: '#222', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  headerWebViewTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeBOButton: { backgroundColor: '#FF3B30', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  closeBOText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
