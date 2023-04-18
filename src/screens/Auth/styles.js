import { StyleSheet } from "react-native";
import { theme } from "../../theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey001,
  },
  optionText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  btnMain: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginTop: 33,
  },
  btnMainLabel: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
  agreement: {
    marginHorizontal: 18,
    marginTop: 10,
    color: theme.colors.grey002,
    fontWeight: "500",
  },
});

export default styles;
