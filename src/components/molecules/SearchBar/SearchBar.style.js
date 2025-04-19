import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    color: COLORS.text,
  },
});
