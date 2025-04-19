import {StyleSheet} from 'react-native';
import {SPACING, FONT_SIZE, BORDER_RADIUS} from './theme';

export default StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.m,
  },

  // Flex styles
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Spacing
  marginBottom: {
    marginBottom: SPACING.m,
  },
  marginTop: {
    marginTop: SPACING.m,
  },
  padding: {
    padding: SPACING.m,
  },

  // Cards
  card: {
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },

  // Text styles
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: FONT_SIZE.l,
    fontWeight: '600',
  },
});
