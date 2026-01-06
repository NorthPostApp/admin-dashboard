import { useNavigate } from "react-router";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import z from "zod";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const LoginForm = z.object({
  account: z.email(),
  password: z.string(),
});
type LoginFormSchema = z.infer<typeof LoginForm>;

export default function Login() {
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      account: "",
      password: "",
    } satisfies LoginFormSchema,
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: {
      onDynamic: LoginForm,
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn(value.account, value.password);
        // toast.success(`welcome back: ${userCredential.user.displayName}`); // will update this
        toast.success("welcome back");
        navigate("/");
      } catch (err) {
        let errorMessage = "Failed to sign in. Please try again";
        if (err instanceof FirebaseError) {
          switch (err.code) {
            case "auth/user-disabled":
              errorMessage = "This account has been disabled";
              break;
            case "auth/user-not-found":
              errorMessage = "No account found with this email";
              break;
            case "auth/wrong-password":
            case "auth/invalid-credential":
            case "auth/invalid-email":
              errorMessage = "Invalid log in credential";
              break;
            case "auth/too-many-requests":
              errorMessage = "Too many failed attempts. Please try again later";
              break;
          }
        }
        toast.error(errorMessage);
        return { form: errorMessage };
      }
    },
  });

  const getFormField = (name: keyof LoginFormSchema) => {
    const type = name === "account" ? "email" : "password";
    const placeholder = type === "email" ? "you@example.com" : "Enter your password";
    const label = name[0].toUpperCase() + name.slice(1);
    return (
      <form.Field
        name={name}
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>NorthPost Admin System</CardTitle>
          <CardDescription>Sign in your admin account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {getFormField("account")}
            {getFormField("password")}
            <form.Subscribe
              selector={(state) => [state.isSubmitting]}
              children={([isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full flex gap-4 mt-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
