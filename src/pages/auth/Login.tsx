import { useNavigate } from "react-router";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { FirebaseError } from "firebase/app";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("login");

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
        toast.success(t("toast.welcome"));
        navigate("/");
      } catch (err) {
        let errorMessage = t("errors.default");
        if (err instanceof FirebaseError) {
          switch (err.code) {
            case "auth/user-disabled":
              errorMessage = t("errors.user-disabled");
              break;
            case "auth/user-not-found":
              errorMessage = t("errors.user-not-found");
              break;
            case "auth/wrong-password":
            case "auth/invalid-credential":
            case "auth/invalid-email":
              errorMessage = t("errors.invalid-credential");
              break;
            case "auth/too-many-requests":
              errorMessage = t("errors.too-many-requests");
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
    const placeholder = t(`fields.${name}.placeholder`);
    const label = t(`fields.${name}.label`);
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
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
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
                  {isSubmitting ? t("button.submitting") : t("button.submit")}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
