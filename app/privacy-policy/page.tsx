import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl text-foreground">
                ShelfControl
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-slate max-w-none">
          <p>
            This privacy policy is applicable to the ShelfControl app
            (hereinafter referred to as &quot;Application&quot;) for mobile
            devices, which was developed by Grizzylabs LLC (hereinafter referred
            to as &quot;Service Provider&quot;) as a a Freemium service. This
            service is provided &quot;AS IS&quot;.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            What information does the Application obtain and how is it used?
          </h2>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
            User Provided Information
          </h3>

          <p>
            The Application acquires the information you supply when you
            download and register the Application. Registration with the Service
            Provider is not mandatory. However, bear in mind that you might not
            be able to utilize some of the features offered by the Application
            unless you register with them.
          </p>

          <p>
            The Service Provider may also use the information you provided them
            to contact you from time to time to provide you with important
            information, required notices and marketing promotions.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
            Automatically Collected Information
          </h3>

          <p>
            In addition, the Application may collect certain information
            automatically, including, but not limited to, the type of mobile
            device you use, your mobile devices unique device ID, the IP address
            of your mobile device, your mobile operating system, the type of
            mobile Internet browsers you use, and information about the way you
            use the Application.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Analytics and App Metrics
          </h2>

          <p>
            The Application uses PostHog, a third-party analytics service, to
            collect anonymized usage metrics and improve the Application&apos;s
            performance and functionality. This helps us understand how users
            interact with the Application and identify areas for improvement.
          </p>

          <p>
            <strong>Important:</strong> Your personal data is never sold to any
            third party for any reason. We only use analytics tools to improve
            the Application experience.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Do third parties see and/or have access to information obtained by
            the Application?
          </h2>

          <p>
            <strong>No personal data is ever shared, sold, or transmitted to
            third parties for marketing, advertising, or any commercial
            purposes.</strong> Your data belongs to you and will never be sold.
          </p>

          <p>
            The only third-party service that receives anonymized, aggregated
            usage metrics is PostHog, which we use solely for analytics to
            improve the Application. This data cannot be used to identify
            individual users.
          </p>

          <p>
            Please note that the Application utilizes third-party services that
            have their own Privacy Policy about handling data. Below are the
            links to the Privacy Policy and Terms of Service of the third-party
            service providers used by the Application:
          </p>

          <ul>
            <li>
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-700 hover:text-violet-800"
              >
                PostHog Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://posthog.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-700 hover:text-violet-800"
              >
                PostHog Terms of Service
              </a>
            </li>
            <li>
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-700 hover:text-violet-800"
              >
                Supabase Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-700 hover:text-violet-800"
              >
                Resend Privacy Policy
              </a>
            </li>
          </ul>

          <p>
            The Service Provider may disclose User Provided and Automatically
            Collected Information only in the following limited circumstances:
          </p>

          <ul>
            <li>
              as required by law, such as to comply with a subpoena, or similar
              legal process;
            </li>
            <li>
              when they believe in good faith that disclosure is necessary to
              protect their rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            What are my opt-out rights?
          </h2>

          <p>
            You can halt all collection of information by the Application easily
            by uninstalling the Application. You may use the standard uninstall
            processes as may be available as part of your mobile device or via
            the mobile application marketplace or network.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Data Retention Policy, Managing Your Information
          </h2>

          <p>
            The Service Provider will retain User Provided data for as long as
            you use the Application and for a reasonable time thereafter. The
            Service Provider will retain Automatically Collected information for
            up to 24 months and thereafter may store it in aggregate. If
            you&apos;d like the Service Provider to delete User Provided Data
            that you have provided via the Application, please contact them at{" "}
            <a
              href="mailto:support@shelfcontrolapp.com"
              className="text-violet-700 hover:text-violet-800"
            >
              support@shelfcontrolapp.com
            </a>{" "}
            and we will respond in a reasonable time. Please note that some or
            all of the User Provided Data may be required in order for the
            Application to function properly.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Children
          </h2>

          <p>
            The Service Provider does not use the Application to knowingly
            solicit data from or market to children under the age of 13.
          </p>

          <p>
            The Application does not address anyone under the age of 13. The
            Service Provider does not knowingly collect personally identifiable
            information from children under 13 years of age. In the case the
            Service Provider discover that a child under 13 has provided
            personal information, the Service Provider will immediately delete
            this from their servers. If you are a parent or guardian and you are
            aware that your child has provided us with personal information,
            please contact the Service Provider (
            <a
              href="mailto:support@shelfcontrolapp.com"
              className="text-violet-700 hover:text-violet-800"
            >
              support@shelfcontrolapp.com
            </a>
            ) so that they will be able to take the necessary actions.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Security
          </h2>

          <p>
            The Service Provider are concerned about safeguarding the
            confidentiality of your information. The Service Provider provide
            physical, electronic, and procedural safeguards to protect
            information we process and maintain. For example, we limit access to
            this information to authorized employees and contractors who need to
            know that information in order to operate, develop or improve their
            Application. Please be aware that, although we endeavor provide
            reasonable security for information we process and maintain, no
            security system can prevent all potential security breaches.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Changes
          </h2>

          <p>
            This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes to the Privacy
            Policy by updating this page with the new Privacy Policy. You are
            advised to consult this Privacy Policy regularly for any changes, as
            continued use is deemed approval of all changes.
          </p>

          <p>This privacy policy is effective as of 2025-10-30</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Your Consent
          </h2>

          <p>
            By using the Application, you are giving your consent to the Service
            Provider processing of your information as set forth in this Privacy
            Policy now and as amended by us. &quot;Processing,&quot; means using
            cookies on a computer/hand held device or using or touching
            information in any way, including, but not limited to, collecting,
            storing, deleting, using, combining and disclosing information.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Contact us
          </h2>

          <p>
            If you have any questions regarding privacy while using the
            Application, or have questions about the practices, please contact
            the Service Provider via email at{" "}
            <a
              href="mailto:support@shelfcontrolapp.com"
              className="text-violet-700 hover:text-violet-800"
            >
              support@shelfcontrolapp.com
            </a>
            .
          </p>

          <hr className="my-8" />

          <p className="text-sm text-muted-foreground">
            This privacy policy page was generated by{" "}
            <a
              href="https://app-privacy-policy-generator.nisrulz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-700 hover:text-violet-800"
            >
              App Privacy Policy Generator
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
