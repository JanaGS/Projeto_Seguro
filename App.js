import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, TextInput } from 'react-native';

export default function App() {
  // Estados do Jogo da Velha
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  // Estado para controlar se exibe o Jogo ou a Tela Oculta
  const [modoSeguroAtivo, setModoSeguroAtivo] = useState(false);

  // Estados da Tela Oculta (Contatos)
  const [contato1, setContato1] = useState('');
  const [contato2, setContato2] = useState('');

  // Lógica do Jogo da Velha
  const handlePress = (index) => {
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

  // 💡 GATILHO SECRETO: Ativa ao segurar o texto por 3 segundos
  const ativarModoSeguro = () => {
    setModoSeguroAtivo(true);
    Alert.alert("Acesso Autorizado", "Modo de segurança oculto ativado com sucesso!");
  };

  const winner = calculateWinner(board);
  const status = winner ? `Vitória: ${winner}` : `Próximo: ${isXNext ? 'X' : 'O'}`;

  // --- SE MODO SEGURO ESTIVER ATIVO: MOSTRA A TELA OCULTA ---
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
          style={styles.panicButton} 
          onPress={() => Alert.alert("SOS Disparado", `Enviando localização atual para os números cadastrados.`)}
        >
          <Text style={styles.panicButtonText}>SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => setModoSeguroAtivo(false)}>
          <Text style={styles.backButtonText}>Voltar para o Jogo (Disfarce)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- CASO CONTRÁRIO: MOSTRA O JOGO DA VELHA (DISFARCE) ---
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

      {/* TEXTO DE CAMUFLAGEM COM O PRESSIONAMENTO DE 3 SEGUNDOS */}
      <View style={styles.footer}>
        <Pressable delayLongPress={3000} onLongPress={ativarModoSeguro}>
          <Text style={styles.footerText}>Versão: v1.0.42 (Build Acadêmica)</Text>
        </Pressable>
      </View>
    </View>
  );
}

function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
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
  // Estilos da Tela Oculta
  alertTitle: { fontSize: 26, fontWeight: 'bold', color: '#FF3B30', marginBottom: 5 },
  alertSubtitle: { fontSize: 14, color: '#aaa', marginBottom: 30, textAlign: 'center' },
  form: { width: '100%', paddingHorizontal: 20, marginBottom: 30 },
  label: { color: '#fff', fontSize: 14, marginBottom: 5 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 6, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  panicButton: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  panicButtonText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  backButton: { padding: 10 },
  backButtonText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' }
});

