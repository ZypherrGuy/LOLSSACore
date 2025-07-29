import { transporter, sendVerificationEmail } from '../../src/utils/email';

describe('sendVerificationEmail util', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, NODE_ENV: 'development' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call transporter.sendMail with correct to, subject and html', async () => {
    const sendMailSpy = jest.spyOn(transporter, 'sendMail').mockResolvedValue({} as any);

    const to = 'foo@bar.com';
    const token = 'abc123';
    await sendVerificationEmail(to, token);

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailSpy.mock.calls[0][0];

    expect(mailOptions.to).toBe(to);

    expect(mailOptions.subject).toMatch(/verify/i);

    expect(mailOptions.html).toContain(encodeURIComponent(token));
    expect(mailOptions.html).toContain(process.env.CLIENT_URL!);

    sendMailSpy.mockRestore();
  });
});
