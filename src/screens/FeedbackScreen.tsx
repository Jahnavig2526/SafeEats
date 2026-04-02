import { Feather } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { feedbackItems } from '../data/mockData'

export function FeedbackScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.subtitle}>Help improve allergen accuracy for everyone</Text>

      <View style={styles.actionRow}>
        <View style={styles.flexOne}>
          <Button label="Mark Safe" icon={<Feather name="shield" size={16} color="#fff" />} />
        </View>
        <View style={styles.flexOne}>
          <Button
            label="Report Issue"
            variant="danger"
            icon={<Feather name="flag" size={16} color="#fff" />}
          />
        </View>
      </View>

      <Card>
        <Text style={styles.commentLabel}>Comment</Text>
        <TextInput
          multiline
          placeholder="Share what happened..."
          placeholderTextColor="#94a3b8"
          style={styles.commentBox}
        />
        <Button label="Submit Feedback" />
      </Card>

      <Text style={styles.section}>Recent reviews</Text>
      {feedbackItems.map((item) => (
        <Card key={item.id}>
          <View style={styles.reviewHead}>
            <Text style={styles.user}>{item.user}</Text>
            <Text style={styles.rating}>{item.rating}.0 / 5</Text>
          </View>
          <Text style={styles.reviewText}>{item.comment}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </Card>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flexOne: {
    flex: 1,
  },
  commentLabel: {
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  commentBox: {
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  user: {
    fontWeight: '700',
    color: '#0f172a',
  },
  rating: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '700',
  },
  reviewText: {
    marginTop: 6,
    color: '#475569',
  },
  date: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 12,
  },
})
