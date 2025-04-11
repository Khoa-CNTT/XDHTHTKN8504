export const AUTH_COLORS = {
  primary: '#28A745',
  text: '#2E3A59',
  textSecondary: '#666',
  background: '#FFFFFF',
  inputBackground: '#F2F2F2',
  border: '#E1E1E1',
  white: '#FFFFFF',
};

export const AUTH_STYLES = {
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
    padding: 20,
  },
  logo: {
    width: 260,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: AUTH_COLORS.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_COLORS.inputBackground,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: AUTH_COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: AUTH_COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}; 