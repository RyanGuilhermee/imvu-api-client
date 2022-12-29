import { RouletteResponse } from "src";

interface UserImvuAccount {
  userId: number;
  imvuAccount: {
    id: number;
    username: string;
    password: string;
  };
}

interface ImvuAccountReward extends UserImvuAccount, RouletteResponse {}

class UserController {
  public userImvuAccounts(): Array<UserImvuAccount> {
    return [
      // {
      //   userId: 1,
      //   imvuAccount: {
      //     id: 1,
      //     username: "ryan.guilherme.740@gmail.com",
      //     password: "00000111ryan",
      //   },
      // },
      // {
      //   userId: 1,
      //   imvuAccount: {
      //     id: 2,
      //     username: "ryan.guilherme.750@gmail.com",
      //     password: "00000111ryan",
      //   },
      // },
      {
        userId: 2,
        imvuAccount: {
          id: 1,
          username: "helena.moreiraa.1945@gmail.com",
          password: "00000111ryan",
        },
      },
    ];
  }

  public rewardsRedeemed(imvuAccountReward: ImvuAccountReward): void {
    // const { userId, imvuAccount, next_available_datetime } = imvuAccountReward;
    // console.log(
    //   "-----------------------------------------------------------------"
    // );
    // console.log({
    //   userId,
    //   imvuAccount,
    //   next_available_datetime,
    // });
    // console.log(
    //   "-----------------------------------------------------------------"
    // );
  }
}

export { ImvuAccountReward, UserController };
