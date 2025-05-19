import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/theme';

export default StyleSheet.create({
  container: {
    width: '47%',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  details: {
    padding: 10,
    paddingBottom: 50,
  },
  price: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  commentButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
});
