import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { ExternalLink } from "lucide-react";

import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomButton from "../../components/ui/CustomButton";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

import { apiEndpoints } from "../../api";

import useVisibilities from "../../hooks/useVisibilities";

const SOCIAL_APPS_LIST = [
  {
    id: 61,
    title: "Facebook",
    category: "Social",
    route: "https://svgl.app/library/facebook-icon.svg",
    wordmark: "https://svgl.app/library/facebook-wordmark.svg",
    url: "https://www.facebook.com",
    brandUrl: "https://about.meta.com/brand/resources/facebook/logo",
  },
  {
    id: 62,
    title: "Twitter",
    category: "Social",
    route: "https://svgl.app/library/twitter.svg",
    url: "https://twitter.com/",
  },
  {
    id: 78,
    title: "YouTube",
    category: ["Google", "Social"],
    route: "https://svgl.app/library/youtube.svg",
    wordmark: {
      light: "https://svgl.app/library/youtube-wordmark-light.svg",
      dark: "https://svgl.app/library/youtube-wordmark-dark.svg",
    },
    url: "https://www.youtube.com",
    brandUrl: "https://brand.youtube",
  },
  {
    id: 85,
    title: "LinkedIn",
    category: "Social",
    route: "https://svgl.app/library/linkedin.svg",
    url: "https://www.linkedin.com/",
    brandUrl: "https://brand.linkedin.com/",
  },
  {
    id: 86,
    title: "Telegram",
    category: "Social",
    route: "https://svgl.app/library/telegram.svg",
    url: "https://web.telegram.org/",
  },
  {
    id: 87,
    title: "Matrix",
    category: "Social",
    route: {
      light: "https://svgl.app/library/matrix-light.svg",
      dark: "https://svgl.app/library/matrix-dark.svg",
    },
    url: "https://matrix.org/",
  },
  {
    id: 88,
    title: "WhatsApp",
    category: "Social",
    route: "https://svgl.app/library/whatsapp-icon.svg",
    wordmark: "https://svgl.app/library/whatsapp-wordmark.svg",
    url: "https://web.whatsapp.com",
    brandUrl: "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand",
  },
  {
    id: 110,
    title: "Arc",
    category: "Social",
    route: {
      light: "https://svgl.app/library/arc.svg",
      dark: "https://svgl.app/library/arc_dark.svg",
    },
    url: "https://arc.dev",
  },
  {
    id: 215,
    title: "Mastodon",
    category: "Social",
    route: "https://svgl.app/library/mastodon.svg",
    url: "https://joinmastodon.org/",
  },
  {
    id: 229,
    title: "Messenger",
    category: "Social",
    route: "https://svgl.app/library/messenger.svg",
    url: "https://www.messenger.com/",
  },
  {
    id: 248,
    title: "Infojobs",
    category: "Social",
    route: "https://svgl.app/library/infojobs-logo.svg",
    url: "https://www.infojobs.net/",
  },
  {
    id: 252,
    title: "Skype",
    category: "Social",
    route: "https://svgl.app/library/skype.svg",
    url: "https://www.skype.com/",
  },
  {
    id: 261,
    title: "Threads",
    category: "Social",
    route: {
      light: "https://svgl.app/library/threads.svg",
      dark: "https://svgl.app/library/threads_dark.svg",
    },
    url: "https://threads.net/",
  },
  {
    id: 262,
    title: "Instagram",
    category: "Social",
    route: "https://svgl.app/library/instagram-icon.svg",
    wordmark: "https://svgl.app/library/instagram-wordmark.svg",
    url: "https://www.instagram.com/",
    brandUrl: "https://about.instagram.com/brand",
  },
  {
    id: 284,
    title: "X (formerly Twitter)",
    category: "Social",
    route: {
      light: "https://svgl.app/library/x.svg",
      dark: "https://svgl.app/library/x_dark.svg",
    },
    url: "https://x.com",
    brandUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
  },
  {
    id: 293,
    title: "VK",
    category: "Social",
    route: "https://svgl.app/library/vk.svg",
    url: "https://vk.com",
  },
  {
    id: 313,
    title: "Hashnode",
    category: "Social",
    route: "https://svgl.app/library/hashnode.svg",
    url: "https://hashnode.com",
  },
  {
    id: 317,
    title: "Patreon",
    category: "Social",
    route: {
      light: "https://svgl.app/library/patreon.svg",
      dark: "https://svgl.app/library/patreon_dark.svg",
    },
    url: "https://www.patreon.com/",
  },
  {
    id: 318,
    title: "Peerlist",
    category: "Social",
    route: "https://svgl.app/library/peerlist.svg",
    url: "https://www.peerlist.io/",
  },
  {
    id: 343,
    title: "Pinterest",
    category: "Social",
    route: "https://svgl.app/library/pinterest.svg",
    url: "https://pinterest.com/",
  },
  {
    id: 353,
    title: "Reddit",
    category: "Social",
    route: "https://svgl.app/library/reddit.svg",
    url: "https://www.reddit.com/",
    brandUrl: "https://redditinc.com/brand",
  },
  {
    id: 404,
    title: "Meta",
    category: "Social",
    route: "https://svgl.app/library/meta.svg",
    url: "https://about.meta.com/es/",
    brandUrl: "https://about.meta.com/brand/resources/",
  },
  {
    id: 426,
    title: "TikTok",
    category: "Social",
    route: {
      light: "https://svgl.app/library/tiktok-icon-light.svg",
      dark: "https://svgl.app/library/tiktok-icon-dark.svg",
    },
    wordmark: {
      light: "https://svgl.app/library/tiktok-wordmark-light.svg",
      dark: "https://svgl.app/library/tiktok-wordmark-dark.svg",
    },
    url: "https://www.tiktok.com",
  },
  {
    id: 471,
    title: "Carrd",
    category: ["Social"],
    route: "https://svgl.app/library/carrd.svg",
    url: "https://carrd.co/",
  },
  {
    id: 475,
    title: "Bluesky",
    category: "Social",
    route: "https://svgl.app/library/bluesky.svg",
    url: "https://blueskyweb.xyz/",
  },
  {
    id: 477,
    title: "daily.dev",
    category: ["Social", "Community"],
    route: {
      light: "https://svgl.app/library/daily-dev-ligth.svg",
      dark: "https://svgl.app/library/daily-dev-dark.svg",
    },
    url: "https://daily.dev/",
  },
  {
    id: 542,
    title: "Zulip",
    category: ["Software", "Social"],
    route: "https://svgl.app/library/zulip.svg",
    wordmark: "https://svgl.app/library/zulip-wordmark.svg",
    url: "https://zulip.com/",
    brandUrl:
      "https://github.com/zulip/zulip/tree/bd29fb3e2691daef570ba5661351922a16782dd2/static/images/logo",
  },
];

const SOCIAL_APPS = SOCIAL_APPS_LIST.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function AddEditSocialAccount() {
  const { visibilities } = useVisibilities();

  const { accountId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm();

  const platformLink = useWatch({ control, name: "link" });

  const getUpdatedFields = (data, dirtyFields) => {
    const updated = {};

    for (const key in dirtyFields) {
      if (
        typeof dirtyFields[key] === "object" &&
        !Array.isArray(dirtyFields[key])
      ) {
        updated[key] = getUpdatedFields(data[key], dirtyFields[key]);
      } else {
        updated[key] = data[key];
      }
    }

    return updated;
  };

  const fetchSocialPlatform = async () => {
    try {
      const res = await apiEndpoints.getSocialPlatform(accountId);

      const data = res.data;

      reset(data);
      console.log("Social Platform: ", data);
    } catch (error) {
      console.error("Error fetching Social Platform: ", error);
    }
  };

  const addUpdatePlatform = async (payload) => {
    const updatedData = getUpdatedFields(payload, dirtyFields);

    try {
      let res;
      if (accountId) {
        res = await apiEndpoints.updateSocialPlatform(accountId, updatedData);
      } else {
        res = await apiEndpoints.addSocialPlatform(updatedData);
      }

      const data = res.data;

      fetchSocialPlatform();
      console.log("Social Platform Saved: ", data);
    } catch (error) {
      console.error("Error saving Social Platform: ", error);
    }
  };

  useEffect(() => {
    if (!accountId) return;
    fetchSocialPlatform();
  }, [accountId]);

  return (
    <form
      onSubmit={handleSubmit(addUpdatePlatform)}
      className="grid grid-cols-12 gap-6 text-sm"
    >
      {/* Platform Name */}
      <LabelInput
        id="name"
        label="Platform Name"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomInput
          id="name"
          type="text"
          placeholder={`Enter Platform Name`}
          {...register("name")}
          error={errors?.name}
        />
      </LabelInput>

      {/* Platform Link */}
      <LabelInput
        id="link"
        label="Link"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        attachment={
          platformLink && (
            <a
              href={platformLink}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <ExternalLink size={13} /> <p>Visit Link</p>
            </a>
          )
        }
        required
      >
        <CustomInput
          id="link"
          type="text"
          placeholder={`Enter Platform Link`}
          {...register("link")}
          error={errors?.link}
        />
      </LabelInput>

      {/* Sort Order */}
      <LabelInput
        id="sortOrder"
        label="Sort Order"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
      >
        <CustomInput
          id="sortOrder"
          type="number"
          min={0}
          placeholder={`Enter Platform Sort Order`}
          {...register("sortOrder", { min: 0 })}
          error={errors?.sortOrder}
        />
      </LabelInput>

      {/* Visibility  */}
      <LabelInput
        id="visibility"
        label="Visibility"
        colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        required
      >
        <CustomRadioButtons
          id="visibility"
          name="visibility"
          options={visibilities}
          {...register("visibility", {
            required: "Visibility is required!",
          })}
          error={errors?.visibility}
        />
      </LabelInput>

      <CustomButton type="submit" className="col-span-12 place-self-end">
        {isSubmitting ? "Saving..." : "Save"}
      </CustomButton>
    </form>
  );
}
