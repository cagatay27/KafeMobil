import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/theme';

export default StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  activeContainer: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  inactiveContainer: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: COLORS.text,
  },
});
