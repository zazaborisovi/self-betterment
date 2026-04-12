import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigation } from "@react-navigation/native";

export const GeneralForm = ({ func }) =>{
    const isSignup = func.name.toLowerCase().includes("signup")

  const [formData, handleChange] = useForm({
    email: "",
    ...isSignup ? { username: "" } : undefined,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useNavigation()

  const handleSubmit = (e) => {
    e.preventDefault()
    func(formData)
  }

  return(
    <View>
      <Text>{isSignup ? "Create Account" : "Welcome Back"}</Text>
      <Text>{isSignup ? "Join us and start your betterment journey" : "Enter your credentials to access your account"}</Text>
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange({ target: { name: "email", value: text } })}
      />
      {isSignup && (
        <TextInput
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleChange({ target: { name: "username", value: text } })}
        />
      )}
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange({ target: { name: "password", value: text } })}
        secureTextEntry={!showPassword}
      />
      <Button title={showPassword ? "Hide Password" : "Show Password"} onPress={() => setShowPassword(!showPassword)} />
      <Button title={isSignup ? "Sign Up" : "Sign In"} onPress={handleSubmit} />
      <Text>{isSignup ? "Already have an account? " : "Don't have an account? "} <Text onPress={() => navigation.navigate(isSignup ? "SignIn" : "SignUp")}>{isSignup ? "Sign In" : "Sign Up"}</Text></Text>
    </View>
  )
}