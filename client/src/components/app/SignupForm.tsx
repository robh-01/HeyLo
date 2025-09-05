import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const singupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof singupSchema>>({
    resolver: zodResolver(singupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof singupSchema>) {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          form.reset();
          alert("Signup successful! Please log in.");
          navigate("/login");
        } else {
          alert(`Signup failed: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        alert("An error occurred during signup. Please try again later.");
      });
  }

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Create a new password" {...field} />
                </FormControl>
                <FormDescription>Create a new password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Signup</Button>
        </form>
      </Form>
    </div>
  );
}
